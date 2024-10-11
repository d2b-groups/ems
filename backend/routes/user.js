// routes/user.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;
  const user = new User({ userName, email, password });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, userName: user.userName });
});

// Get User Details
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password'); // Exclude password from the result

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user); // Send user details
});

module.exports = router;
