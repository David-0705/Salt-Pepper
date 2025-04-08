// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();

// // Enhanced logging middleware
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   next();
// });

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:19006',
//   credentials: true
// }));

// // Database Connection with enhanced logging
// console.log('Attempting to connect to MongoDB...');
// mongoose.connect('mongodb+srv://afernandes1808:CooSocCnjkVuntlG@cluster0.lz0dy.mongodb.net/myDatabase?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('✅ Successfully connected to MongoDB Atlas (myDatabase)');
//   console.log('Collections in database:', mongoose.connection.db.listCollections().toArray());
// })
// .catch(err => {
//   console.error('❌ Database connection error:', err);
//   process.exit(1);
// });

// // User Schema
// const UserSchema = new mongoose.Schema({
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: { 
//     type: String, 
//     required: true,
//     minlength: 6
//   },
//   userType: { 
//     type: String, 
//     enum: ['regular', 'admin', 'authority'], 
//     default: 'regular' 
//   },
//   authorityType: { 
//     type: String, 
//     enum: ['police', 'traffic_police', 'ngo'] 
//   },
//   priority: { 
//     type: String, 
//     enum: ['low', 'medium', 'high', 'critical'], 
//     default: 'low' 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Password hashing middleware with logging
// UserSchema.pre('save', async function(next) {
//   console.log(`Pre-save hook for user ${this.email}`);
//   if (!this.isModified('password')) {
//     console.log('Password not modified, skipping hash');
//     return next();
//   }
  
//   try {
//     console.log('Hashing password...');
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     console.log('Password hashed successfully');
//     next();
//   } catch (err) {
//     console.error('Password hashing error:', err);
//     next(err);
//   }
// });

// // Method to compare passwords with logging
// UserSchema.methods.comparePassword = async function(candidatePassword) {
//   console.log(`Comparing passwords for user ${this.email}`);
//   try {
//     // const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     // console.log('Password comparison result:', isMatch);
//     // return isMatch;
//     return candidatePassword == this.password; 
//   } catch (err) {
//     console.error('Password comparison error:', err);
//     throw err;
//   }
// };

// const User = mongoose.model('User', UserSchema, 'users');

// // Enhanced login endpoint with detailed logging
// app.post('/api/login', async (req, res) => {
//   console.log('\n=== NEW LOGIN ATTEMPT ===');
//   console.log('Request body:', req.body);

//   try {
//     const { email, password, userType, authorityType } = req.body;

//     // Input validation
//     if (!email || !password) {
//       console.log('Validation failed: Missing email or password');
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     console.log(`Looking for user with email: ${email}`);
//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user) {
//       console.log('User not found in database');
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log('Found user:', {
//       id: user._id,
//       email: user.email,
//       userType: user.userType,
//       authorityType: user.authorityType,
//       password:user.password
//     });

//     // Verify user type if provided
//     if (userType && user.userType !== userType) {
//       console.log(`User type mismatch: Expected ${userType}, found ${user.userType}`);
//       return res.status(401).json({ message: 'Invalid user type for this account' });
//     }

//     // Verify authority type if applicable
//     if (userType === 'authority' && user.authorityType !== authorityType) {
//       console.log(`Authority type mismatch: Expected ${authorityType}, found ${user.authorityType}`);
//       return res.status(401).json({ message: 'Invalid authority type' });
//     }

//     console.log('Comparing passwords...');
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       console.log('Password does not match');
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log('Creating JWT token...');
//     const token = jwt.sign(
//       { 
//         userId: user._id, 
//         userType: user.userType, 
//         authorityType: user.authorityType 
//       },
//       process.env.JWT_SECRET || 'fallback_secret_at_least_32_chars_long',
//       { expiresIn: '1h' }
//     );

//     console.log('Login successful! Returning response...');
//     res.json({ 
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         userType: user.userType,
//         authorityType: user.authorityType,
//         priority: user.priority
//       }
//     });

//   } catch (err) {
//     console.error('❌ Login process error:', err);
//     res.status(500).json({ 
//       message: 'Server error during login',
//       error: err.message,
//       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
//   } finally {
//     console.log('=== LOGIN PROCESS COMPLETED ===\n');
//   }
// });

// // Error handling middleware with logging
// app.use((err, req, res, next) => {
//   console.error('❌ Unhandled error:', err);
//   res.status(500).json({ 
//     message: 'Internal server error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`\n🚀 Server running on port ${PORT}`);
//   console.log(`🔗 Endpoints:`);
//   console.log(`- POST http://localhost:${PORT}/api/login`);
// });


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();

// // Enhanced logging middleware
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   next();
// });

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:19006',
//   credentials: true
// }));

// // Database Connection with enhanced logging
// console.log('Attempting to connect to MongoDB...');
// mongoose.connect('mongodb+srv://afernandes1808:CooSocCnjkVuntlG@cluster0.lz0dy.mongodb.net/myDatabase?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('✅ Successfully connected to MongoDB Atlas (myDatabase)');
//   console.log('Collections in database:', mongoose.connection.db.listCollections().toArray());
// })
// .catch(err => {
//   console.error('❌ Database connection error:', err);
//   process.exit(1);
// });

// // User Schema with fullName
// const UserSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: { 
//     type: String, 
//     required: true,
//     minlength: 6
//   },
//   userType: { 
//     type: String, 
//     enum: ['regular', 'admin', 'authority'], 
//     default: 'regular' 
//   },
//   authorityType: { 
//     type: String, 
//     enum: ['police', 'traffic_police', 'ngo'] 
//   },
//   priority: { 
//     type: String, 
//     enum: ['low', 'medium', 'high', 'critical'], 
//     default: 'low' 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Password hashing middleware with logging
// UserSchema.pre('save', async function(next) {
//   console.log(`Pre-save hook for user ${this.email}`);
//   if (!this.isModified('password')) {
//     console.log('Password not modified, skipping hash');
//     return next();
//   }
  
//   try {
//     console.log('Hashing password...');
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     console.log('Password hashed successfully');
//     next();
//   } catch (err) {
//     console.error('Password hashing error:', err);
//     next(err);
//   }
// });

// // Method to compare passwords with logging
// UserSchema.methods.comparePassword = async function(candidatePassword) {
//   console.log(`Comparing passwords for user ${this.email}`);
//   try {
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     console.log('Password comparison result:', isMatch);
//     // return candidatePassword == this.password; 
//     return isMatch;
//   } catch (err) {
//     console.error('Password comparison error:', err);
//     throw err;
//   }
// };

// const User = mongoose.model('User', UserSchema, 'users');

// // Registration Endpoint
// // Registration Endpoint - Add this to your existing server code
// app.post('/api/register', async (req, res) => {
//     console.log('\n=== NEW REGISTRATION ATTEMPT ===');
//     console.log('Request body:', req.body);
  
//     try {
//       const { fullName, email, password, userType = 'regular' } = req.body;
  
//       // Input validation
//       if (!fullName || !email || !password) {
//         console.log('Validation failed: Missing fields');
//         return res.status(400).json({ message: 'All fields are required' });
//       }
  
//       console.log(`Checking if email ${email} already exists`);
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         console.log('Email already exists in database');
//         return res.status(400).json({ message: 'Email already registered' });
//       }
  
//       console.log('Creating new user...');
//       const newUser = new User({
//         fullName,
//         email,
//         password, // This will be hashed by the pre-save hook
//         userType,
//         authorityType: null, // Explicitly set to null for regular users
//         priority: 'low' // Default priority
//       });
  
//       // Save the user (this will trigger the password hashing)
//       await newUser.save();
      
//       console.log('User created successfully. MongoDB result:', {
//         id: newUser._id,
//         email: newUser.email,
//         userType: newUser.userType,
//         authorityType: newUser.authorityType,
//         priority: newUser.priority
//       });
  
//       // Verify the user was actually created
//       const dbUser = await User.findById(newUser._id);
//       if (!dbUser) {
//         console.error('User not found after creation!');
//         throw new Error('User creation verification failed');
//       }
  
//       console.log('Database verification successful:', dbUser);
  
//       // Generate JWT token (optional - you can remove if not needed)
//       const token = jwt.sign(
//         { 
//           userId: newUser._id, 
//           userType: newUser.userType, 
//           authorityType: newUser.authorityType 
//         },
//         process.env.JWT_SECRET || 'fallback_secret_at_least_32_chars_long',
//         { expiresIn: '1h' }
//       );
  
//       console.log('Registration successful! Returning response...');
//       res.status(201).json({ 
//         success: true,
//         message: 'User registered successfully',
//         user: {
//           id: newUser._id,
//           fullName: newUser.fullName,
//           email: newUser.email,
//           userType: newUser.userType
//         },
//         token // Optional
//       });
  
//     } catch (error) {
//       console.error('❌ Registration process error:', error);
//       res.status(500).json({ 
//         success: false,
//         message: 'Registration failed',
//         error: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     } finally {
//       console.log('=== REGISTRATION PROCESS COMPLETED ===\n');
//     }
//   });


//   // Get all crime reports (with pagination and filtering)
// app.get('/api/crime-reports', async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 10, 
//       status, 
//       category, 
//       severity,
//       userId
//     } = req.query;
    
//     const query = {};
    
//     // Apply filters if provided
//     if (status) query.status = status;
//     if (category) query.crimeCategory = category;
//     if (severity) query.severity = severity;
//     if (userId) query.userId = userId;
    
//     const options = {
//       sort: { createdAt: -1 }, // Sort by newest first
//       limit: parseInt(limit),
//       skip: (parseInt(page) - 1) * parseInt(limit)
//     };
    
//     const reports = await CrimeReport.find(query, null, options);
//     const total = await CrimeReport.countDocuments(query);
    
//     res.json({
//       reports,
//       totalPages: Math.ceil(total / parseInt(limit)),
//       currentPage: parseInt(page),
//       totalReports: total
//     });
//   } catch (error) {
//     console.error('Error fetching crime reports:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get a specific crime report by ID
// app.get('/api/crime-reports/:id', async (req, res) => {
//   try {
//     const report = await CrimeReport.findById(req.params.id);
    
//     if (!report) {
//       return res.status(404).json({ message: 'Report not found' });
//     }
    
//     res.json(report);
//   } catch (error) {
//     console.error('Error fetching crime report:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update a crime report (for authorities to change status, etc.)
// app.put('/api/crime-reports/:id', async (req, res) => {
//   try {
//     const { status, notes } = req.body;
    
//     // Here you would normally verify the user has permission to update
//     // For example, check JWT token to confirm they're an authority
    
//     const updatedReport = await CrimeReport.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status,
//         $push: { 
//           statusUpdates: { 
//             status, 
//             notes, 
//             updatedAt: new Date(),
//             // updatedBy: req.user.id // If you're using authentication
//           } 
//         }
//       },
//       { new: true }
//     );
    
//     if (!updatedReport) {
//       return res.status(404).json({ message: 'Report not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       message: 'Report updated successfully',
//       report: updatedReport
//     });
//   } catch (error) {
//     console.error('Error updating crime report:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get crime reports statistics
// app.get('/api/crime-reports/stats/summary', async (req, res) => {
//   try {
//     const totalReports = await CrimeReport.countDocuments();
    
//     const categoryCounts = await CrimeReport.aggregate([
//       { $group: { _id: '$crimeCategory', count: { $sum: 1 } } },
//       { $sort: { count: -1 } }
//     ]);
    
//     const statusCounts = await CrimeReport.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);
    
//     const severityCounts = await CrimeReport.aggregate([
//       { $group: { _id: '$severity', count: { $sum: 1 } } }
//     ]);
    
//     res.json({
//       totalReports,
//       byCategory: categoryCounts,
//       byStatus: statusCounts,
//       bySeverity: severityCounts
//     });
//   } catch (error) {
//     console.error('Error fetching crime report statistics:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // KEEPING THE LOGIN ENDPOINT EXACTLY AS IT WAS
// app.post('/api/login', async (req, res) => {
//   console.log('\n=== NEW LOGIN ATTEMPT ===');
//   console.log('Request body:', req.body);

//   try {
//     const { email, password, userType, authorityType } = req.body;

//     // Input validation
//     if (!email || !password) {
//       console.log('Validation failed: Missing email or password');
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     console.log(`Looking for user with email: ${email}`);
//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user) {
//       console.log('User not found in database');
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log('Found user:', {
//       id: user._id,
//       email: user.email,
//       userType: user.userType,
//       authorityType: user.authorityType
//     });

//     // Verify user type if provided
//     if (userType && user.userType !== userType) {
//       console.log(`User type mismatch: Expected ${userType}, found ${user.userType}`);
//       return res.status(401).json({ message: 'Invalid user type for this account' });
//     }

//     // Verify authority type if applicable
//     if (userType === 'authority' && user.authorityType !== authorityType) {
//       console.log(`Authority type mismatch: Expected ${authorityType}, found ${user.authorityType}`);
//       return res.status(401).json({ message: 'Invalid authority type' });
//     }

//     console.log('Comparing passwords...');
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       console.log('Password does not match');
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log('Creating JWT token...');
//     const token = jwt.sign(
//       { 
//         userId: user._id, 
//         userType: user.userType, 
//         authorityType: user.authorityType 
//       },
//       process.env.JWT_SECRET || 'fallback_secret_at_least_32_chars_long',
//       { expiresIn: '1h' }
//     );

//     console.log('Login successful! Returning response...');
//     res.json({ 
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         userType: user.userType,
//         authorityType: user.authorityType,
//         priority: user.priority
//       }
//     });

//   } catch (err) {
//     console.error('❌ Login process error:', err);
//     res.status(500).json({ 
//       message: 'Server error during login',
//       error: err.message,
//       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
//   } finally {
//     console.log('=== LOGIN PROCESS COMPLETED ===\n');
//   }
// });

// // Error handling middleware with logging
// app.use((err, req, res, next) => {
//   console.error('❌ Unhandled error:', err);
//   res.status(500).json({ 
//     message: 'Internal server error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`\n🚀 Server running on port ${PORT}`);
//   console.log(`🔗 Endpoints:`);
//   console.log(`- POST http://localhost:${PORT}/api/register`);
//   console.log(`- POST http://localhost:${PORT}/api/login`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:19006',
  credentials: true
}));

// Database Connection with enhanced logging
console.log('Attempting to connect to MongoDB...');

// MongoDB Connection & GridFS setup
let gfs;
mongoose.connect('mongodb+srv://afernandes1808:CooSocCnjkVuntlG@cluster0.lz0dy.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas (myDatabase)');
  
  // Initialize GridFS bucket
  const db = mongoose.connection.db;
  gfs = new GridFSBucket(db, {
    bucketName: 'uploads'
  });
  
  console.log('✅ GridFS initialized for file storage');
})
.catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    // Check file types
    const filetypes = /jpeg|jpg|png|mp4|mov/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error('Only image and video files are allowed!'), false);
  }
});

// User Schema with fullName
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  userType: { 
    type: String, 
    enum: ['regular', 'admin', 'authority'], 
    default: 'regular' 
  },
  authorityType: { 
    type: String, 
    enum: ['police', 'traffic_police', 'ngo'] 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'low' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware with logging
UserSchema.pre('save', async function(next) {
  console.log(`Pre-save hook for user ${this.email}`);
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }
  
  try {
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (err) {
    console.error('Password hashing error:', err);
    next(err);
  }
});

// Method to compare passwords with logging
UserSchema.methods.comparePassword = async function(candidatePassword) {
  console.log(`Comparing passwords for user ${this.email}`);
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (err) {
    console.error('Password comparison error:', err);
    throw err;
  }
};

const User = mongoose.model('User', UserSchema, 'users');

// Crime Report Schema
const CrimeReportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number
    },
    required: true
  },
  media: [{
    fileId: String,
    filename: String,
    type: {
      type: String,
      enum: ['image', 'video']
    }
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  crimeCategory: {
    type: String,
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Not required if anonymous
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'closed'],
    default: 'pending'
  },
  statusUpdates: [{
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'closed']
    },
    notes: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CrimeReport = mongoose.model('CrimeReport', CrimeReportSchema, 'crimereports');

// ======= API ENDPOINTS =======

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  console.log('\n=== NEW REGISTRATION ATTEMPT ===');
  console.log('Request body:', req.body);

  try {
    const { fullName, email, password, userType = 'regular' } = req.body;

    // Input validation
    if (!fullName || !email || !password) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log(`Checking if email ${email} already exists`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists in database');
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('Creating new user...');
    const newUser = new User({
      fullName,
      email,
      password, // This will be hashed by the pre-save hook
      userType,
      authorityType: null, // Explicitly set to null for regular users
      priority: 'low' // Default priority
    });

    // Save the user (this will trigger the password hashing)
    await newUser.save();
    
    console.log('User created successfully. MongoDB result:', {
      id: newUser._id,
      email: newUser.email,
      userType: newUser.userType,
      authorityType: newUser.authorityType,
      priority: newUser.priority
    });

    // Verify the user was actually created
    const dbUser = await User.findById(newUser._id);
    if (!dbUser) {
      console.error('User not found after creation!');
      throw new Error('User creation verification failed');
    }

    console.log('Database verification successful:', dbUser);

    // Generate JWT token (optional - you can remove if not needed)
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        userType: newUser.userType, 
        authorityType: newUser.authorityType 
      },
      process.env.JWT_SECRET || 'fallback_secret_at_least_32_chars_long',
      { expiresIn: '1h' }
    );

    console.log('Registration successful! Returning response...');
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        userType: newUser.userType
      },
      token // Optional
    });

  } catch (error) {
    console.error('❌ Registration process error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    console.log('=== REGISTRATION PROCESS COMPLETED ===\n');
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  console.log('\n=== NEW LOGIN ATTEMPT ===');
  console.log('Request body:', req.body);

  try {
    const { email, password, userType, authorityType } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('Validation failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log(`Looking for user with email: ${email}`);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Found user:', {
      id: user._id,
      email: user.email,
      userType: user.userType,
      authorityType: user.authorityType
    });

    // Verify user type if provided
    if (userType && user.userType !== userType) {
      console.log(`User type mismatch: Expected ${userType}, found ${user.userType}`);
      return res.status(401).json({ message: 'Invalid user type for this account' });
    }

    // Verify authority type if applicable
    if (userType === 'authority' && user.authorityType !== authorityType) {
      console.log(`Authority type mismatch: Expected ${authorityType}, found ${user.authorityType}`);
      return res.status(401).json({ message: 'Invalid authority type' });
    }

    console.log('Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Creating JWT token...');
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType, 
        authorityType: user.authorityType 
      },
      process.env.JWT_SECRET || 'fallback_secret_at_least_32_chars_long',
      { expiresIn: '1h' }
    );

    console.log('Login successful! Returning response...');
    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        authorityType: user.authorityType,
        priority: user.priority
      }
    });

  } catch (err) {
    console.error('❌ Login process error:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    console.log('=== LOGIN PROCESS COMPLETED ===\n');
  }
});

// Media Upload Endpoint using GridFS
app.post('/api/upload-media', upload.array('media', 5), async (req, res) => {
  try {
    console.log('\n=== NEW MEDIA UPLOAD ===');
    console.log(`Uploading ${req.files.length} files...`);
    
    const fileResults = [];
    
    for (const file of req.files) {
      const filename = `${uuidv4()}-${file.originalname}`;
      const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
      
      // Create a stream to upload to GridFS
      const uploadStream = gfs.openUploadStream(filename, {
        contentType: file.mimetype
      });
      
      // Write buffer to GridFS
      uploadStream.write(file.buffer);
      uploadStream.end();
      
      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });
      
      // Add file metadata to results
      fileResults.push({
        fileId: uploadStream.id.toString(),
        filename: filename,
        type: fileType
      });
      
      console.log(`File uploaded: ${filename}, ID: ${uploadStream.id}`);
    }
    
    console.log('Media uploaded successfully:', fileResults);
    res.status(200).json({ success: true, files: fileResults });
  } catch (error) {
    console.error('❌ Media upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload media', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    console.log('=== MEDIA UPLOAD COMPLETED ===\n');
  }
});

// Get media file by ID
app.get('/api/media/:fileId', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    
    // Find file metadata
    const files = await mongoose.connection.db.collection('uploads.files').findOne({ _id: fileId });
    
    if (!files) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Set appropriate content type
    res.set('Content-Type', files.contentType);
    
    // Create download stream
    const downloadStream = gfs.openDownloadStream(fileId);
    
    // Pipe the file data to the response
    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Crime Report Submission Endpoint
app.post('/api/crime-report', async (req, res) => {
  console.log('\n=== NEW CRIME REPORT SUBMISSION ===');
  console.log('Request body:', req.body);
  try {
    const { 
      description, 
      location, 
      media, // Now contains fileId references from GridFS
      severity, 
      crimeCategory, 
      isAnonymous,
      userId // Optional, depending on if anonymous or not
    } = req.body;
    // Input validation
    if (!description || !location || !crimeCategory) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Description, location, and crime category are required' });
    }
    console.log('Creating new crime report...');
    const newCrimeReport = new CrimeReport({
      description,
      location,
      media: media || [],
      severity,
      crimeCategory,
      isAnonymous,
      userId: isAnonymous ? null : userId,
      statusUpdates: [{
        status: 'pending',
        notes: 'Initial report submitted',
        updatedAt: new Date()
      }]
    });
    // Save the crime report
    await newCrimeReport.save();
    
    console.log('Crime report created successfully. MongoDB result:', {
      id: newCrimeReport._id,
      category: newCrimeReport.crimeCategory,
      severity: newCrimeReport.severity,
      isAnonymous: newCrimeReport.isAnonymous
    });
    console.log('Report submission successful! Returning response...');
    res.status(201).json({ 
      success: true,
      message: 'Crime report submitted successfully',
      reportId: newCrimeReport._id
    });
  } catch (error) {
    console.error('❌ Report submission error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Report submission failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    console.log('=== CRIME REPORT SUBMISSION COMPLETED ===\n');
  }
});

// Get all crime reports (with pagination and filtering)
app.get('/api/crime-reports', async (req, res) => {
  try {
    console.log('\n=== FETCHING CRIME REPORTS ===');
    console.log('Query parameters:', req.query);
    
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      severity,
      userId
    } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (status) query.status = status;
    if (category) query.crimeCategory = category;
    if (severity) query.severity = severity;
    if (userId) query.userId = userId;
    
    const options = {
      sort: { createdAt: -1 }, // Sort by newest first
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };
    
    console.log('Executing query with filters:', query);
    const reports = await CrimeReport.find(query, null, options);
    const total = await CrimeReport.countDocuments(query);
    
    // Enhance reports with file URLs
    const enhancedReports = reports.map(report => {
      const reportObj = report.toObject();
      
      // Add file access URLs to media
      if (reportObj.media && reportObj.media.length > 0) {
        reportObj.media = reportObj.media.map(mediaItem => ({
          ...mediaItem,
          url: `/api/media/${mediaItem.fileId}`
        }));
      }
      
      return reportObj;
    });
    
    console.log(`Found ${reports.length} reports of ${total} total`);
    res.json({
      reports: enhancedReports,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalReports: total
    });
  } catch (error) {
    console.error('❌ Error fetching crime reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    console.log('=== FETCH CRIME REPORTS COMPLETED ===\n');
  }
});

// Get a specific crime report by ID
app.get('/api/crime-reports/:id', async (req, res) => {
  try {
    console.log(`\n=== FETCHING CRIME REPORT ${req.params.id} ===`);
    
    const report = await CrimeReport.findById(req.params.id);
    
    if (!report) {
      console.log('Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Convert to plain object to modify
    const reportObj = report.toObject();
    
    // Add file access URLs to media
    if (reportObj.media && reportObj.media.length > 0) {
      reportObj.media = reportObj.media.map(mediaItem => ({
        ...mediaItem,
        url: `/api/media/${mediaItem.fileId}`
      }));
    }
    
    console.log('Report found:', report._id);
    res.json(reportObj);
  } catch (error) {
    console.error('❌ Error fetching crime report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    console.log('=== FETCH CRIME REPORT COMPLETED ===\n');
  }
});

// Update a crime report (for authorities to change status, etc.)
app.put('/api/crime-reports/:id', async (req, res) => {
  try {
    console.log(`\n=== UPDATING CRIME REPORT ${req.params.id} ===`);
    console.log('Request body:', req.body);
    
    const { status, notes, updatedBy } = req.body;
    
    // Here you would normally verify the user has permission to update
    // For example, check JWT token to confirm they're an authority
    
    const updatedReport = await CrimeReport.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        $push: { 
          statusUpdates: { 
            status, 
            notes, 
            updatedAt: new Date(),
            updatedBy // This should be the user ID of the authority
          } 
        }
      },
      { new: true }
    );
    
    if (!updatedReport) {
      console.log('Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }
    
    console.log('Report updated successfully:', {
      id: updatedReport._id,
      newStatus: status
    });
    
    // Convert to plain object to modify
    const reportObj = updatedReport.toObject();
    
    // Add file access URLs to media
    if (reportObj.media && reportObj.media.length > 0) {
      reportObj.media = reportObj.media.map(mediaItem => ({
        ...mediaItem,
        url: `/api/media/${mediaItem.fileId}`
      }));
    }
    
    res.json({ 
      success: true, 
      message: 'Report updated successfully',
      report: reportObj
    });
  } catch (error) {
    console.error('❌ Error updating crime report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    console.log('=== UPDATE CRIME REPORT COMPLETED ===\n');
  }
});

// Get crime reports statistics
app.get('/api/crime-reports/stats/summary', async (req, res) => {
  try {
    console.log('\n=== FETCHING CRIME STATISTICS ===');
    
    const totalReports = await CrimeReport.countDocuments();
    
    const categoryCounts = await CrimeReport.aggregate([
      { $group: { _id: '$crimeCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const statusCounts = await CrimeReport.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const severityCounts = await CrimeReport.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    console.log('Statistics generated successfully');
    res.json({
      totalReports,
      byCategory: categoryCounts,
      byStatus: statusCounts,
      bySeverity: severityCounts
    });
  } catch (error) {
    console.error('❌ Error fetching crime report statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    console.log('=== FETCH CRIME STATISTICS COMPLETED ===\n');
  }
});

// Error handling middleware with logging
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 Main Endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/register - Register a new user`);
  console.log(`- POST http://localhost:${PORT}/api/login - Login to the system`);
  console.log(`- POST http://localhost:${PORT}/api/upload-media - Upload images/videos`);
  console.log(`- GET http://localhost:${PORT}/api/media/:fileId - View uploaded media`);
  console.log(`- POST http://localhost:${PORT}/api/crime-report - Submit a crime report`);
  console.log(`- GET http://localhost:${PORT}/api/crime-reports - Get all crime reports (with filtering)`);
  console.log(`- GET http://localhost:${PORT}/api/crime-reports/stats/summary - Get crime statistics`);
  console.log(`\n📁 For more details, check the documentation`);
});