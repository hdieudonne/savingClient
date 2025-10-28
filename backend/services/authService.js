const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    });
  }

  // Register new user
  async register(userData) {
    const { fullName, email, phoneNumber, password, deviceId, deviceName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      throw new Error('User with this email or phone number already exists');
    }

    // Create user with device
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      devices: [{
        deviceId,
        deviceName: deviceName || 'Unknown Device',
        isVerified: false
      }]
    });

    return user;
  }

  // Login user
  async login(email, password, deviceId) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordCorrect = user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials');
    }

    // Check if device exists for this user
    const deviceExists = user.devices.some(d => d.deviceId === deviceId);

    if (!deviceExists) {
      // Add new device (unverified)
      user.devices.push({
        deviceId,
        deviceName: 'Unknown Device',
        isVerified: false
      });
      await user.save();
    }

    // Check if device is verified
    if (!user.isDeviceVerified(deviceId)) {
      const error = new Error('Device not verified');
      error.code = 'DEVICE_NOT_VERIFIED';
      throw error;
    }

    return user;
  }

  // Get user profile
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();