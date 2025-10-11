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
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Available' }).populate('disposer_id', 'username');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single listing by its ID
// @route   GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('disposer_id', 'username');

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

// @desc    Get listings for the logged-in user
// @route   GET /api/listings/my-listings
const getMyListings = async (req, res) => {
  try {
    // req.user.id comes from our 'protect' middleware
    const listings = await Listing.find({ disposer_id: req.user.id }).populate('disposer_id', 'username');
    res.json(listings);
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
};