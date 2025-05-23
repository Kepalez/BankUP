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

// Ruta para obtener un cliente por ID
app.get('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM client WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
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

app.get('/api/user/:id/balance', async (req, res) => {
  try {
    const result = await pool.query(`SELECT account.balance FROM account JOIN client ON account.client_id = client.id JOIN app_user ON app_user.client_id = client.id WHERE app_user.id = ${req.params.id}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

app.get('/api/user/:id/transferences', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          transfer.source_client_name,
          transfer.destination_client_name,
          transfer.transfer_date,
          transfer.amount,
          transfer.concept
      FROM (
          SELECT
              transfer.id,
              transfer.transfer_date,
              transfer.amount,
              transfer.concept,
              source_account.client_id as source_client_id,
              source_account.client_name as source_client_name,
              destination_account.client_id as destination_client_id,
              destination_account.client_name as destination_client_name
          FROM transfer
          JOIN
          (
              SELECT
                  transfer.id as transfer_id,
                  client.id as client_id,
                  client.first_name || ' ' || client.last_name as client_name
              FROM transfer
              JOIN account
                  ON transfer.source_account_id = account.id
              JOIN client
                  ON account.client_id = client.id
          ) source_account
              ON source_account.transfer_id = transfer.id
          JOIN (
              SELECT
                  transfer.id as transfer_id,
                  client.id as client_id,
                  client.first_name || ' ' || client.last_name as client_name
              FROM transfer
              JOIN account
                  ON transfer.destination_account_id = account.id
              JOIN client
                  ON account.client_id = client.id
          ) destination_account
              ON destination_account.transfer_id = transfer.id
      ) transfer
      JOIN app_user
          ON app_user.client_id = transfer.source_client_id OR app_user.client_id = transfer.destination_client_id
      WHERE app_user.id = ${req.params.id}`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});
  
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar el usuario en la base de datos
    const userQuery = await pool.query(
      `SELECT app_user.*, user_status.status_name 
       FROM app_user 
       JOIN user_status ON app_user.user_status_id = user_status.id
       WHERE username = $1`,
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = userQuery.rows[0];


    if (user.status_name === 'blocked') {
      return res.status(403).json({ error: 'Cuenta bloqueada. Contacte al administrador.' });
    }


    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      const failedAttempts = user.failed_attempts ? user.failed_attempts + 1 : 1;
      
      if (failedAttempts >= 3) {
        await pool.query(
          'UPDATE app_user SET user_status_id = (SELECT id FROM user_status WHERE status_name = $1), failed_attempts = $2 WHERE id = $3',
          ['blocked', failedAttempts, user.id]
        );
        return res.status(403).json({ error: 'Demasiados intentos fallidos. Cuenta bloqueada.' });
      } else {
        // Actualizar solo el contador de intentos fallidos
        await pool.query(
          'UPDATE app_user SET failed_attempts = $1 WHERE id = $2',
          [failedAttempts, user.id]
        );
        return res.status(401).json({ 
          error: 'Contraseña incorrecta', 
          attemptsLeft: 3 - failedAttempts 
        });
      }
    }

    await pool.query(
      'UPDATE app_user SET failed_attempts = 0 WHERE id = $1',
      [user.id]
    );

    const userData = {
      userId: user.id,
      username: user.username,
      role_id: user.role_id,
      clientId: user.client_id,
      status: user.status_name
    };

    res.json(userData);

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/users', async (req, res) => {
  console.log('Endpoint /api/users alcanzado');
  try {
    const userQuery = `
      SELECT 
        u.id, 
        u.username, 
        u.failed_attempts,
        CONCAT(c.first_name, ' ', c.last_name) AS client_name,
        us.status_name AS status,
        r.role_name AS role
      FROM 
        app_user u
      JOIN 
        client c ON u.client_id = c.id
      JOIN 
        user_status us ON u.user_status_id = us.id
      JOIN 
        role r ON u.role_id = r.id
    `;
    const { rows } = await pool.query(userQuery);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Endpoint para desbloquear usuario
app.put('/api/users/:id/unblock', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtener el ID del estado "active"
    const statusQuery = "SELECT id FROM user_status WHERE status_name = 'active'";
    const statusResult = await pool.query(statusQuery);
    const activeStatusId = statusResult.rows[0].id;
    
    // Actualizar el usuario
    const updateQuery = `
      UPDATE app_user 
      SET user_status_id = $1, failed_attempts = 0 
      WHERE id = $2
      RETURNING *
    `;
    await pool.query(updateQuery, [activeStatusId, id]);
    
    res.json({ success: true, message: 'Usuario desbloqueado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al desbloquear usuario' });
  }
});

// Endpoints para cuentas
app.get('/api/accounts', async (req, res) => {
  try {
    const accountQuery = `
      SELECT 
        a.id, 
        a.account_number, 
        CONCAT(c.first_name, ' ', c.last_name) AS client_name,
        a.balance,
        astatus.status_name AS status,
        a.aperture_date
      FROM 
        account a
      JOIN 
        client c ON a.client_id = c.id
      JOIN 
        account_status astatus ON a.account_status_id = astatus.id
    `;
    const { rows } = await pool.query(accountQuery);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cuentas' });
  }
});

// Endpoint para descongelar cuenta
app.put('/api/accounts/:id/unfreeze', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtener el ID del estado "active"
    const statusQuery = "SELECT id FROM account_status WHERE status_name = 'active'";
    const statusResult = await pool.query(statusQuery);
    const activeStatusId = statusResult.rows[0].id;
    
    // Actualizar la cuenta
    const updateQuery = `
      UPDATE account 
      SET account_status_id = $1
      WHERE id = $2
      RETURNING *
    `;
    await pool.query(updateQuery, [activeStatusId, id]);
    
    res.json({ success: true, message: 'Cuenta descongelada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al descongelar cuenta' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});