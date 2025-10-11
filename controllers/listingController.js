const Listing = require('../models/Listing');
const cloudinary = require('../config/cloudinary');
// @desc    Create a new listing
// @route   POST /api/listings
const createListing = async (req, res) => {
  try {
    let imageUrl = '';
    // Check if a file was uploaded
    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      );
      imageUrl = result.secure_url;
    }

    const { title, description, device_type, condition, latitude, longitude } = req.body;
    const newListing = new Listing({
      title,
      description,
      device_type,
      condition,
      latitude,
      longitude,
      imageUrl, // Save the image URL to the database
      disposer_id: req.user.id,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all available listings
// @route   GET /api/listings
// controllers/listingController.js
const getAllListings = async (req, res) => {
  try {
    // 1. Create a filter object
    const filter = { status: 'Available' };

    // 2. Check if a device_type query parameter was sent
    if (req.query.device_type) {
      filter.device_type = req.query.device_type;
    }

    // 3. Use the filter object in the find query
    const listings = await Listing.find(filter).populate('disposer_id', 'username');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single listing by its ID
// @route   GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
  .populate('disposer_id', 'username email mobile_number');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    // Check if the user owns the listing
    if (listing.disposer_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    // Check if the user owns the listing
    if (listing.disposer_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// controllers/listingController.js

// @desc    Get listings for the logged-in user
// @route   GET /api/listings/my-listings
const getMyListings = async (req, res) => {
  console.log('--- Entering getMyListings function ---'); // Log 1

  try {
    // Check if the middleware provided the user object
    if (!req.user) {
      console.error('CRITICAL: req.user is NOT DEFINED. Middleware might have failed.');
      return res.status(401).json({ message: 'Not authorized, user data missing.' });
    }
    console.log('Step 1: req.user object exists:', req.user); // Log 2

    // Check if the user object has an ID
    if (!req.user.id) {
        console.error('CRITICAL: req.user.id is NOT DEFINED.');
        return res.status(500).json({ message: 'Server error, user ID is missing.'});
    }
    console.log('Step 2: req.user.id is:', req.user.id); // Log 3

    // Now, try to find the listings
    const listings = await Listing.find({ disposer_id: req.user.id }).populate(
      'disposer_id',
      'username'
    );
    console.log('Step 3: Found listings:', listings.length); // Log 4

    res.json(listings);

  } catch (error) {
    // This will now catch and print any error during the process
    console.error('---!!! CRASH in getMyListings !!!---:', error); 
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Update a listing's status
// @route   PUT /api/listings/:id/status
const updateListingStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Verify the logged-in user owns this listing
    if (listing.disposer_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    listing.status = 'Collected'; // Update the status
    await listing.save();
    res.json({ message: 'Listing status updated to Collected' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
  updateListingStatus,
};