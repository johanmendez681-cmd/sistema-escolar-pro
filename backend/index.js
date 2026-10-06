const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middlewares: Para que el frontend y el backend se entiendan
app.use(cors());
app.use(express.json());

// Conexión a la Bóveda de PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Ruta para obtener las estadísticas en tiempo real del Dashboard
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        // Ejecutamos las 4 consultas en paralelo para máxima velocidad
        const [users, grades, demerits, notices] = await Promise.all([
            pool.query('SELECT COUNT(*) as total FROM usuarios'),
            pool.query('SELECT AVG(nota) as promedio FROM calificaciones'),
            pool.query('SELECT SUM(cantidad_demeritos) as total FROM actas_disciplinarias'),
            pool.query('SELECT COUNT(*) as total FROM cartelera_institucional')
        ]);

        // --- MÓDULO DE GESTIÓN DE USUARIOS ---

// 1. Obtener la lista completa de usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        // Traemos todos menos la contraseña por seguridad
        const result = await pool.query('SELECT id, correo, rol, fecha_creacion FROM usuarios ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
});

// 3. Eliminar un usuario del sistema (¡Destrucción en cascada!)
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ exito: true, mensaje: 'Usuario y todos sus registros han sido eliminados.' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Falla al intentar eliminar el usuario' });
    }
});

// --- MÓDULO DE CALIFICACIONES ---

// 1. Obtener el historial de notas (Cruzando datos con la tabla de usuarios)
app.get('/api/calificaciones', async (req, res) => {
    try {
        const query = `
            SELECT c.id, u.correo as alumno_correo, c.materia, c.periodo, c.nota, c.fecha_registro
            FROM calificaciones c
            JOIN usuarios u ON c.alumno_id = u.id
            ORDER BY c.fecha_registro DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo calificaciones:', error);
        res.status(500).json({ error: 'Error al obtener calificaciones' });
    }
});

// 2. Registrar una nueva calificación
app.post('/api/calificaciones', async (req, res) => {
    const { alumno_id, materia, periodo, nota } = req.body;
    
    try {
        await pool.query(
            'INSERT INTO calificaciones (alumno_id, materia, periodo, nota) VALUES ($1, $2, $3, $4)',
            [alumno_id, materia, periodo, nota]
        );
        res.json({ exito: true, mensaje: 'Calificación registrada exitosamente.' });
    } catch (error) {
        console.error('Error guardando calificación:', error);
        res.status(500).json({ error: 'Error interno al registrar la nota' });
    }
});

// 2. Registrar un nuevo usuario (Alumno, Docente o Director)
app.post('/api/usuarios', async (req, res) => {
    const { correo, password, rol } = req.body;
    
    try {
        // Verificamos que el correo no esté duplicado
        const existe = await pool.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ exito: false, mensaje: 'Este correo ya está registrado en el sistema.' });
        }

        // Insertamos al nuevo usuario
        const result = await pool.query(
            'INSERT INTO usuarios (correo, password, rol) VALUES ($1, $2, $3) RETURNING id, correo, rol',
            [correo, password, rol]
        );
        
        res.json({ exito: true, mensaje: 'Usuario registrado con éxito', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ error: 'Error interno al registrar el usuario' });
    }
});

        // Formateamos los datos asegurándonos de que si no hay nada, devuelva 0
        const promedio = grades.rows[0].promedio ? parseFloat(grades.rows[0].promedio).toFixed(1) : '0.0';
        const totalDemeritos = demerits.rows[0].total ? parseInt(demerits.rows[0].total) : 0;

        res.json({
            totalUsuarios: parseInt(users.rows[0].total) || 0,
            promedioInstitucional: promedio,
            demeritosActivos: totalDemeritos,
            avisosActivos: parseInt(notices.rows[0].total) || 0
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error interno al calcular estadísticas' });
    }
});

// Ruta de prueba para verificar que el puente funciona
app.get('/api/estado', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            estado: 'Conectado al 100%', 
            mensaje: '¡El cerebro del Sistema Escolar Pro está en línea!',
            hora_servidor: result.rows[0].now 
        });
    } catch (error) {
        console.error('Error de conexión:', error);
        res.status(500).json({ error: 'Falla en la Matrix. Revisa la contraseña en tu archivo .env' });
    }
});

// Ruta principal de Autenticación (Login)
app.post('/api/login', async (req, res) => {
    const { correo, password, rol_esperado } = req.body;

    try {
        // Buscamos al usuario en la bóveda
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE correo = $1 AND password = $2', 
            [correo, password]
        );

        if (result.rows.length > 0) {
            const usuario = result.rows[0];
            
            // Verificamos que no intente entrar con un rol que no le corresponde
            if (usuario.rol !== rol_esperado) {
                return res.status(403).json({ exito: false, mensaje: 'Acceso denegado: Rol incorrecto' });
            }

            res.json({ exito: true, mensaje: `Bienvenido, ${usuario.rol}`, rol: usuario.rol });
        } else {
            res.status(401).json({ exito: false, mensaje: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Encendido del motor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor central operando en el puerto ${PORT}`);
});