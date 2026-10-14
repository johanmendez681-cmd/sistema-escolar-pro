const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a tu servidor MySQL local
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'johan12345Jr' // <--- Escribe aquí tu contraseña de MySQL
});

// 2. Creación automática de la Base de Datos y las 3 Tablas Separadas
db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        return;
    }
    console.log('✅ Conexión a MySQL exitosa');

    db.query("CREATE DATABASE IF NOT EXISTS sistema_escolar", (err) => {
        if (err) throw err;

        db.query("USE sistema_escolar", (err) => {
            if (err) throw err;

            // TABLA 1: USUARIOS (Exclusiva para el Login y Registro)
            const sqlUsuarios = `
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    correo VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL,
                    rol VARCHAR(30) NOT NULL DEFAULT 'Director',
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.query(sqlUsuarios, (err) => {
                if (err) throw err;

                // Usuario oficial por defecto para que siempre puedas entrar
                const adminPorDefecto = `
                    INSERT IGNORE INTO usuarios (nombre, correo, password, rol)
                    VALUES ('Dirección Académica', 'director@juttasteiner.edu.sv', 'admin123', 'Director')
                `;
                db.query(adminPorDefecto);
            });

            // TABLA 2: ACTAS (Exclusiva para Actas Disciplinarias)
            const sqlActas = `
                CREATE TABLE IF NOT EXISTS actas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    fecha VARCHAR(50) NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    grado VARCHAR(50) NOT NULL,
                    seccion VARCHAR(10) NOT NULL,
                    motivo TEXT NOT NULL,
                    cantidad VARCHAR(10) NOT NULL,
                    emitido_por VARCHAR(100) DEFAULT 'Dirección Académica'
                )
            `;
            db.query(sqlActas, (err) => {
                if (err) throw err;
            });

            // TABLA 3: DEMERITOS (Exclusiva para Boletas de Deméritos)
            const sqlDemeritos = `
                CREATE TABLE IF NOT EXISTS demeritos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    fecha VARCHAR(50) NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    grado VARCHAR(50) NOT NULL,
                    seccion VARCHAR(10) NOT NULL,
                    motivo TEXT NOT NULL,
                    cantidad VARCHAR(10) NOT NULL,
                    emitido_por VARCHAR(100) DEFAULT 'Dirección Académica'
                )
            `;
            db.query(sqlDemeritos, (err) => {
                if (err) throw err;
                console.log('✅ Tablas MySQL listas y separadas: [1. usuarios] [2. actas] [3. demeritos]');
            });
        });
    });
});

// ====================================================
// RUTAS DE LA TABLA 1: USUARIOS (LOGIN Y REGISTRO)
// ====================================================
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body;
    const query = 'SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND password = ?';
    db.query(query, [correo, password], (err, results) => {
        if (err) return res.status(500).json({ exito: false, mensaje: 'Error en el servidor MySQL' });
        if (results.length > 0) {
            res.json({ exito: true, usuario: results[0] });
        } else {
            res.status(401).json({ exito: false, mensaje: 'Correo o contraseña incorrectos' });
        }
    });
});

app.post('/api/registro', (req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const query = 'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, correo, password, rol || 'Docente'], (err, results) => {
        if (err) {
            return res.status(400).json({ exito: false, mensaje: 'Ese correo ya está registrado en la tabla usuarios' });
        }
        res.json({
            exito: true,
            usuario: { id: results.insertId, nombre, correo, rol: rol || 'Docente' }
        });
    });
});

// ====================================================
// RUTAS DE LA TABLA 2: ACTAS DISCIPLINARIAS
// ====================================================
app.get('/api/actas', (req, res) => {
    db.query('SELECT * FROM actas ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/actas', (req, res) => {
    const { fecha, nombre, grado, seccion, motivo, cantidad, emitido_por } = req.body;
    const query = 'INSERT INTO actas (fecha, nombre, grado, seccion, motivo, cantidad, emitido_por) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [fecha, nombre, grado, seccion, motivo, cantidad, emitido_por || 'Dirección Académica'], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, tipo: 'actas', ...req.body });
    });
});

app.delete('/api/actas/:id', (req, res) => {
    db.query('DELETE FROM actas WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Acta eliminada correctamente');
    });
});

// ====================================================
// RUTAS DE LA TABLA 3: DEMÉRITOS
// ====================================================
app.get('/api/demeritos', (req, res) => {
    db.query('SELECT * FROM demeritos ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/demeritos', (req, res) => {
    const { fecha, nombre, grado, seccion, motivo, cantidad, emitido_por } = req.body;
    const query = 'INSERT INTO demeritos (fecha, nombre, grado, seccion, motivo, cantidad, emitido_por) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [fecha, nombre, grado, seccion, motivo, cantidad, emitido_por || 'Dirección Académica'], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, tipo: 'demeritos', ...req.body });
    });
});

app.delete('/api/demeritos/:id', (req, res) => {
    db.query('DELETE FROM demeritos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Demérito eliminado correctamente');
    });
});

app.listen(3000, () => console.log('🚀 Servidor Backend corriendo en el puerto 3000'));