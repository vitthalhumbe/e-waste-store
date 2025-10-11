// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    enum: ['Disposer', 'Collector'],
    required: true,
  },
  green_points: {
    type: Number,
    default: 0,
  },
  // --- NEW FIELDS ---
  spcb_authorization_number: {
    type: String,
    default: null, // Only required for Collectors
  },
  account_status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Approved', // Disposers are approved by default
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);