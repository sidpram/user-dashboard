/* ==========================================================================
   User Registration Dashboard - Backend API Server (Local Testing Mode)
   backend/server.js
   ========================================================================== */

const express = require(`express`);
const cors = require(`cors`);
const fs = require("fs");
const path = require("path");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Allows your local frontend file to communicate with the local API
//app.use(express.static(path.join(__dirname, "public"))); // Looks for the `public` folder at the root
// --- IN-MEMORY DATABASE FOR LOCAL TESTING ---
// This replaces MongoDB temporarily so you can test full interaction right now.
let userMockDatabase = [];
let nextId = 1;
let requestCount = 0;


console.log(`📝 Running in Local Memory Mode. No MongoDB connection required.`);

// 3. API Endpoints

/**
 * @route   POST /api/users
 * @desc    Register a new user profile entry (Saves to Memory)
 */
app.post(`/api/users`, async (req, res) => {
  try {
    const { name, email, month, year } = req.body;
    const log = `Add User Request #${name}, ${email} , ${month} , ${year}  - ${new Date().toISOString()}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', 'logs.txt'), log);
    month
    // Check if email address is already registered in our memory array
    const duplicateCheck = userMockDatabase.find(
      user => user.email.toLowerCase() === email.toLowerCase().trim()
    );
    
    if (duplicateCheck) {
      return res.status(400).json({ error: `This email address is already registered.` });
    }

    // Create a mock user object mirroring the MongoDB structure
    const newUser = {
      _id: (nextId++).toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      month: month,
      year: parseInt(year, 10),
      createdAt: new Date().toISOString()
    };

    userMockDatabase.push(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: `Server validation failure: ` + error.message });
  }
});

/**
 * @route   GET /api/users
 * @desc    Fetch and filter all logged profile entries from memory
 */
app.get(`/api/users`, async (req, res) => {
  requestCount++;

    const log = `Request #${requestCount} - ${new Date().toISOString()}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', 'logs.txt'), log);
  try {
    const { search } = req.query;
    let filteredUsers = [...userMockDatabase];

    // Dynamic search parsing layer if a query string is present
    if (search) {
      const searchLower = search.toLowerCase().trim();
      
      filteredUsers = filteredUsers.filter(user => {
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.month.toLowerCase().includes(searchLower) ||
          user.year.toString().includes(searchLower)
        );
      });
    }

    // Sort entries so newest records show up on top (matching MongoDB`s sort)
    filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.json(filteredUsers);
  } catch (error) {
    return res.status(500).json({ error: `Data pipeline error: ` + error.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Remove a user profile record from memory by ID
 */
app.delete(`/api/users/:id`, async (req, res) => {
  try {
    const targetId = req.params.id;
    const initialLength = userMockDatabase.length;
    
    // Filter out the requested user record
    userMockDatabase = userMockDatabase.filter(user => user._id !== targetId);
    
    if (userMockDatabase.length === initialLength) {
      return res.status(404).json({ error: `Requested record match index not found.` });
    }
    
    return res.json({ message: `User record removed from local memory registry.` });
  } catch (error) {
    return res.status(500).json({ error: `Destruction execution process fault: ` + error.message });
  }
});

// 4. Server Boot Sequence
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  fs.appendFileSync(path.join(__dirname, 'logs', 'logs.txt'), `Backend cluster listening actively across connection channel port: ${PORT}\n`);
  console.log(`📡 Backend cluster listening actively across connection channel port: ${PORT}`);
  console.log(`👉 Open your frontend index.html file directly in your browser to start interacting!`);
});