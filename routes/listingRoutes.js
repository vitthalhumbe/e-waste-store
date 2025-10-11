const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware'); // We only need 'protect' for now

// Import ALL your controller functions
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
} = require('../controllers/listingController');

// Setup multer
const upload = multer({ storage: multer.memoryStorage() });

// --- DEFINE ROUTES IN THE CORRECT ORDER ---

// 1. General, public routes first
router.get('/', getAllListings);

// 2. Specific routes next (like '/my-listings')
//    This route is protected and must come BEFORE the '/:id' route
router.get('/my-listings', protect, getMyListings);

// 3. Parameterized routes last
//    This is the general route for a single listing
router.get('/:id', getListingById);

// 4. Routes that create or modify data
router.post('/', protect, upload.single('image'), createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;