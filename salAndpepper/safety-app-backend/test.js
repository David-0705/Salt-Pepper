const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Better error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection pool with better error handling
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'suno_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Database config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  // password hidden for security
});

// First try to connect without specifying a database
const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });
    
    const connection = await tempPool.getConnection();
    console.log('✅ MySQL server connection successful!');
    
    // Check if database exists
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${dbConfig.database}'`);
    
    if (rows.length === 0) {
      console.log(`Database '${dbConfig.database}' does not exist. Creating it...`);
      await connection.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`✅ Database '${dbConfig.database}' created successfully!`);
    } else {
      console.log(`✅ Database '${dbConfig.database}' exists!`);
    }
    
    // Switch to the database
    await connection.query(`USE ${dbConfig.database}`);
    
    // Check if users table exists
    const [tables] = await connection.query(`SHOW TABLES LIKE 'users'`);
    
    if (tables.length === 0) {
      console.log(`Table 'users' does not exist. Creating it...`);
      await connection.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          user_type ENUM('user', 'admin', 'authority') NOT NULL,
          authority_type VARCHAR(50),
          priority ENUM('low', 'medium', 'high', 'critical') NOT NULL
        )
      `);
      console.log(`✅ Table 'users' created successfully!`);
    } else {
      console.log(`✅ Table 'users' exists!`);
    }
    
    connection.release();
    await tempPool.end();
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error(`Make sure MySQL is running on ${dbConfig.host} and accepting connections on port 3306`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`Access denied for user '${dbConfig.user}'. Check your username and password.`);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Database '${dbConfig.database}' does not exist.`);
    }
    return false;
  }
};

// Create the main database pool only after verifying connection
let pool;

testConnection().then(success => {
  if (success) {
    pool = mysql.createPool(dbConfig);
    console.log('Main connection pool created successfully');
    
    // Start server only after database connection is verified
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Server not started due to database connection issues');
    process.exit(1);
  }
}).catch(err => {
  console.error('Fatal error during connection test:', err);
  process.exit(1);
});

// Test database connection endpoint
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ status: 'success', message: 'Database connected successfully', data: rows });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ status: 'error', message: 'Database query failed', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, userType, authorityType } = req.body;
    
    // Basic validation
    if (!email || !password || !userType) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }
    
    // Authority type validation
    if (userType === 'authority' && !authorityType) {
      return res.status(400).json({ status: 'error', message: 'Authority type is required for authority users' });
    }
    
    // Query to find user with matching credentials
    let query = 'SELECT * FROM users WHERE email = ? AND password = ? AND user_type = ?';
    let params = [email, password, userType];
    
    // Add authority type to query if applicable
    if (userType === 'authority') {
      query += ' AND authority_type = ?';
      params.push(authorityType);
    }
    
    const [users] = await pool.query(query, params);
    
    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials or user type' });
    }
    
    const user = users[0];
    
    // Remove password from response
    delete user.password;
    
    // Return user data
    res.json({ 
      status: 'success', 
      message: 'Login successful', 
      user: user
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, userType, authorityType, name } = req.body;
    
    // Basic validation
    if (!email || !password || !userType || !name) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }
    
    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Email already registered' });
    }
    
    // Set priority based on user type
    let priority = 'low';
    if (userType === 'admin') priority = 'high';
    else if (userType === 'authority') {
      if (authorityType === 'police') priority = 'critical';
      else if (authorityType === 'traffic_police') priority = 'high';
      else if (authorityType === 'ngo') priority = 'medium';
    }
    
    // Insert new user
    let query = 'INSERT INTO users (name, email, password, user_type, priority';
    let values = [name, email, password, userType, priority];
    
    // Add authority type if applicable
    if (userType === 'authority') {
      query += ', authority_type) VALUES (?, ?, ?, ?, ?, ?)';
      values.push(authorityType);
    } else {
      query += ') VALUES (?, ?, ?, ?, ?)';
    }
    
    const [result] = await pool.query(query, values);
    
    res.status(201).json({ 
      status: 'success', 
      message: 'User registered successfully', 
      userId: result.insertId 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  if (pool) {
    pool.end().then(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});