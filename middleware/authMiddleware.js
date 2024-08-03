// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.SECRET); // Replace 'your_jwt_secret' with your actual secret
  req.user = decoded;

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Only superadmins can perform this action.' });
  }

  next();
};

module.exports = authMiddleware;
