// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- UPDATED registerUser function ---
const registerUser = async (req, res) => {
  try {
    const { username, email, password, user_type, spcb_authorization_number, mobile_number, address } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      user_type,
      mobile_number, // <-- Add this
  address, 
    };

    // --- Verification Logic ---
    if (user_type === 'Collector') {
      if (!spcb_authorization_number) {
        return res.status(400).json({ message: 'SPCB Authorization Number is required for Collectors.' });
      }
      newUser.spcb_authorization_number = spcb_authorization_number;
      newUser.account_status = 'Pending'; // Collectors need admin approval
    }

    const user = await User.create(newUser);
    res.status(201).json({ _id: user._id, username: user.username, message: "Registration successful. Collector accounts require approval." });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- UPDATED loginUser function ---
const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne(email ? { email } : { username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // --- Approval Check ---
      if (user.account_status !== 'Approved') {
        return res.status(403).json({ message: `Your account is currently ${user.account_status}. Please wait for admin approval.` });
      }

      const token = jwt.sign(
        { id: user._id, user_type: user.user_type, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, loginUser };