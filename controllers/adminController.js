// controllers/adminController.js
const User = require('../models/User');

// @desc    Get all collector accounts
const getAllCollectors = async (req, res) => {
  try {
    const collectors = await User.find({ user_type: 'Collector' }).select(
      'username email spcb_authorization_number account_status createdAt'
    );
    res.json(collectors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a user's account status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { account_status: status },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: `User ${user.username} status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAllCollectors, updateUserStatus };