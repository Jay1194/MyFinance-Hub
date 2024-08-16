const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email -_id');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    if (!req.body.email || !req.body.password) {
      console.log('Registration failed: Email and password are required');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log('Registration failed: Email already exists');
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    console.log('User registered successfully:', user.email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: 'Cannot find user' });
    }
    
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.status(401).json({ error: 'Not Allowed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;