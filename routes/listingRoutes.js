const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // <-- Import
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} = require('../controllers/listingController');

router.get('/', getAllListings);
router.get('/:id', getListingById);

// Add 'protect' to these routes
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;