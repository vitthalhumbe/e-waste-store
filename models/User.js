const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Usernames should be unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Emails should be unique
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    enum: ['Disposer', 'Collector'], // Must be one of these two values
    required: true,
  },
  green_points: {
    type: Number,
    default: 0, // Start with 0 points
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('User', UserSchema);