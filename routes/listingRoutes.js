const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

// 1. Import ALL your controller functions in ONE place
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
} = require('../controllers/listingController');

// 2. Setup multer
const upload = multer({ storage: multer.memoryStorage() });

// 3. Define each route only ONCE
router.get('/', getAllListings);
router.get('/:id', getListingById);

// The POST route includes protection and the image upload middleware
router.post('/', protect, upload.single('image'), createListing);

router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);


router.get('/', getAllListings);
router.get('/my-listings', protect, getMyListings); // <-- ADD THIS NEW ROUTE
router.get('/:id', getListingById);
module.exports = router;