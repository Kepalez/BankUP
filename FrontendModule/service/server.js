const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres_db',
  password: 'p.postgres',
  port: 5432,
});

// Ruta para obtener clientes
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM client WHERE last_name ='Gomez';`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});