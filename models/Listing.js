const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  disposer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  device_type: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Pending Pickup', 'Collected'],
    default: 'Available', // New listings will automatically have this status
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  imageUrl: {
    type: String, // We will store the URL of the uploaded image
  },
}, {
  timestamps: true, // This automatically adds 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('Listing', ListingSchema);