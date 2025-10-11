const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminMiddleware');
const { getAllCollectors, updateUserStatus } = require('../controllers/adminController');

// Protect all routes in this file with the admin password
router.use(adminProtect);

router.get('/collectors', getAllCollectors);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;