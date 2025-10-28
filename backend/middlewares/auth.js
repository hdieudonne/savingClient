const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Verify device is registered and verified
const verifyDevice = async (req, res, next) => {
  try {
    const deviceId = req.headers['x-device-id'];

    if (!deviceId) {
      return res.status(403).json({
        success: false,
        message: 'Device ID is required'
      });
    }

    // Check if device is verified for this user
    if (!req.user.isDeviceVerified(deviceId)) {
      return res.status(403).json({
        success: false,
        message: 'Device not verified. Please contact admin for verification.',
        deviceId: deviceId
      });
    }

    req.deviceId = deviceId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during device verification'
    });
  }
};

module.exports = { protect, verifyDevice };