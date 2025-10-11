const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('--- Entering protect middleware ---'); // Log 1

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Step 1: Token found:', token.substring(0, 15) + '...'); // Log 2

      // Verify token
      console.log('Step 2: Verifying token...'); // Log 3
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Step 3: Token verified. Decoded ID:', decoded.id); // Log 4

      // Get user from the token and attach it to the request
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Step 4: User found in DB:', req.user.username); // Log 5

      next(); // This passes control to the next function (getMyListings)

    } catch (error) {
      // This will now CATCH and print the real error
      console.error('---!!! CRASH in protect middleware !!!---:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('No token found in headers.');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };