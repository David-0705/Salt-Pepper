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


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
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
mongoose.connect('mongodb+srv://afernandes1808:CooSocCnjkVuntlG@cluster0.lz0dy.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas (myDatabase)');
  console.log('Collections in database:', mongoose.connection.db.listCollections().toArray());
})
.catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
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
    // return candidatePassword == this.password; 
    return isMatch;
  } catch (err) {
    console.error('Password comparison error:', err);
    throw err;
  }
};

const User = mongoose.model('User', UserSchema, 'users');

// Registration Endpoint
// Registration Endpoint - Add this to your existing server code
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

// KEEPING THE LOGIN ENDPOINT EXACTLY AS IT WAS
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
  console.log(`🔗 Endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/register`);
  console.log(`- POST http://localhost:${PORT}/api/login`);
});