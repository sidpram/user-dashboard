/* ==========================================================================
   User Registration Dashboard - Backend API Server (MongoDB Enabled)
   backend/server.js
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

let requestCount = 0;

// Helper function to handle async file logging
const logToFile = (message) => {
  const logPath = path.join(__dirname, 'logs', 'logs.txt');
  fs.appendFile(logPath, message, (err) => {
    if (err) console.error('Failed to write log:', err.message);
  });
};

// ==========================================================================
// API Endpoints
// ==========================================================================
app.post('/health', async (req, res) => {
    res.status(200).json({ 
      status: 'UP', 
      message: 'Yes, Backend is running properly.', 
      timestamp: new Date().toISOString() });
});

/**
 * @route   POST /api/users
 * @desc    Register a new user profile entry (Saves to MongoDB)
 */
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, month, year } = req.body;

    logToFile(`Add User Request #${name}, ${email} , ${month} , ${year} - ${new Date().toISOString()}\n`);

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'This email address is already registered.' });
    }

    // Save user to MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      month,
      year: parseInt(year, 10),
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Server validation failure: ' + error.message });
  }
});

/**
 * @route   GET /api/users
 * @desc    Fetch and filter all logged profile entries from MongoDB
 */
app.get('/api/users', async (req, res) => {
  try {
    requestCount++;
    logToFile(`Request #${requestCount} - ${new Date().toISOString()}\n`);

    const { search } = req.query;
    let query = {};

    // Dynamic search across multiple fields in MongoDB
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchNumber = parseInt(search, 10);

      query = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { month: searchRegex },
          ...(!isNaN(searchNumber) ? [{ year: searchNumber }] : []),
        ],
      };
    }

    // Fetch records sorted by newest first
    const users = await User.find(query).sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Data pipeline error: ' + error.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Remove a user profile record from MongoDB by ID
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Requested record match index not found.' });
    }

    return res.json({ message: 'User record removed from database registry.' });
  } catch (error) {
    return res.status(500).json({ error: 'Destruction execution process fault: ' + error.message });
  }
});

// ==========================================================================
// Server Boot Sequence
// ==========================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logToFile(`Backend cluster listening actively across connection channel port: ${PORT}\n`);
  console.log(`📡 Backend cluster listening actively across connection channel port: ${PORT}`);
});