const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conectamos a MySQL SIN especificar la base de datos todavía
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'johan12345Jr' // <--- Escribe tu contraseña aquí
});

// 2. Proceso automático: Conectar, crear Base de Datos y crear Tabla
db.connect(err => {
    if(err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conexión inicial a MySQL exitosa');

    // Crear la base de datos si no existe
    db.query("CREATE DATABASE IF NOT EXISTS sistema_escolar", (err) => {
        if(err) throw err;
        
        // Usar la base de datos
        db.query("USE sistema_escolar", (err) => {
            if(err) throw err;

            // Crear la tabla automáticamente si no existe
            const crearTablaSQL = `
                CREATE TABLE IF NOT EXISTS registros (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    tipo VARCHAR(20) NOT NULL,
                    fecha VARCHAR(50) NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    grado VARCHAR(50) NOT NULL,
                    seccion VARCHAR(10) NOT NULL,
                    motivo TEXT NOT NULL,
                    cantidad VARCHAR(10) NOT NULL
                )
            `;
            db.query(crearTablaSQL, (err) => {
                if(err) throw err;
                console.log('✅ Base de datos "sistema_escolar" y tabla "registros" listas y operativas!');
            });
        });
    });
});

// --- RUTAS DE LA API ---

// Obtener todos los registros
app.get('/api/registros', (req, res) => {
    db.query('SELECT * FROM registros ORDER BY id DESC', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});

// Guardar un nuevo registro (Acta o Demérito)
app.post('/api/registros', (req, res) => {
    const { tipo, fecha, nombre, grado, seccion, motivo, cantidad } = req.body;
    const query = 'INSERT INTO registros (tipo, fecha, nombre, grado, seccion, motivo, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [tipo, fecha, nombre, grado, seccion, motivo, cantidad], (err, results) => {
        if(err) return res.status(500).send(err);
        res.json({ id: results.insertId, ...req.body });
    });
});

// Eliminar un registro
app.delete('/api/registros/:id', (req, res) => {
    db.query('DELETE FROM registros WHERE id = ?', [req.params.id], (err) => {
        if(err) return res.status(500).send(err);
        res.send('Registro eliminado');
    });
});

app.listen(3000, () => console.log('🚀 Backend MySQL corriendo en puerto 3000'));