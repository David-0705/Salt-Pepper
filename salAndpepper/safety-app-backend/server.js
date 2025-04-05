const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:19006', // Expo web
    'http://10.0.2.2:19006', // Android emulator
    /\.yourdomain\.com$/, // Your production domain
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'suno_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
  // Note: Not logging password for security
});

let pool; // Will be initialized after connection test

// Test and initialize database connection
async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    
    // First test basic connection without specifying database
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      waitForConnections: true,
      connectionLimit: 1
    });
    
    const connection = await tempPool.getConnection();
    console.log('✅ MySQL server connection successful!');
    
    // Check if database exists
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${dbConfig.database}'`);
    
    if (rows.length === 0) {
      console.log(`Database '${dbConfig.database}' does not exist. Creating it...`);
      await connection.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`✅ Database '${dbConfig.database}' created successfully!`);
    }
    
    // Switch to our database
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
          priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log(`✅ Table 'users' created successfully!`);
    }
    
    connection.release();
    await tempPool.end();
    
    // Now create the main pool
    pool = mysql.createPool(dbConfig);
    console.log('Main connection pool created successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    
    // Specific error handling
    if (error.code === 'ECONNREFUSED') {
      console.error(`Make sure MySQL is running on ${dbConfig.host} and accepting connections on port 3306`);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`Access denied for user '${dbConfig.user}'. Check your username and password.`);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Database '${dbConfig.database}' does not exist.`);
    }
    
    return false;
  }
}

// Error handling improvements
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Test database connection endpoint
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ 
      status: 'success', 
      message: 'Database connected successfully', 
      data: rows,
      serverPort: PORT
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Login endpoint with improved validation
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { email, password, userType, authorityType } = req.body;
    
    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields',
        required: ['email', 'password', 'userType']
      });
    }
    
    if (userType === 'authority' && !authorityType) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Authority type is required for authority users',
        validAuthorityTypes: ['police', 'traffic_police', 'ngo']
      });
    }
    
    // Parameterized query
    let query = 'SELECT * FROM users WHERE email = ? AND password = ? AND user_type = ?';
    let params = [email, password, userType];
    
    if (userType === 'authority') {
      query += ' AND authority_type = ?';
      params.push(authorityType);
    }
    
    const [users] = await pool.query(query, params);
    
    if (users.length === 0) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid credentials or user type' 
      });
    }
    
    const user = users[0];
    delete user.password; // Never send password back
    
    res.json({ 
      status: 'success', 
      message: 'Login successful', 
      user: user
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Registration endpoint with enhanced validation
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, userType, authorityType, name } = req.body;
    
    // Validation
    if (!email || !password || !userType || !name) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields',
        required: ['email', 'password', 'userType', 'name']
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid email format' 
      });
    }
    
    // Check for existing user
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        status: 'error', 
        message: 'Email already registered' 
      });
    }
    
    // Set priority based on user type
    let priority = 'low';
    if (userType === 'admin') priority = 'high';
    else if (userType === 'authority') {
      if (authorityType === 'police') priority = 'critical';
      else if (authorityType === 'traffic_police') priority = 'high';
      else if (authorityType === 'ngo') priority = 'medium';
    }
    
    // Build query dynamically
    let query = 'INSERT INTO users (name, email, password, user_type, priority';
    let values = [name, email, password, userType, priority];
    
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
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Initialize and start server
async function startServer() {
  const dbInitialized = await initializeDatabase();
  
  if (!dbInitialized) {
    console.error('Cannot start server without database connection');
    process.exit(1);
  }
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  }).on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      pool.end().then(() => {
        console.log('Database pool closed');
        process.exit(0);
      });
    });
  });
}

startServer();

// Keep-alive logging
setInterval(() => {
  console.log('Server is still running...');
}, 60000);