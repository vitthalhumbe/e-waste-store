// middleware/adminMiddleware.js
const adminProtect = (req, res, next) => {
  const password = req.headers['x-admin-password'];

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Admin Password' });
  }
  next(); // If password is correct, proceed
};

module.exports = { adminProtect };