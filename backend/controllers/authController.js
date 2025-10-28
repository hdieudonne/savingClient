const authService = require('../services/authService');
const { AuthResponseDTO, UserWithDevicesDTO } = require('../dtos/userDTO');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const user = await authService.register(req.validatedBody);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please wait for device verification.',
        data: {
          userId: user._id,
          email: user.email,
          deviceStatus: 'pending_verification'
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password, deviceId } = req.validatedBody;

      const user = await authService.login(email, password, deviceId);
      const token = authService.generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        data: new AuthResponseDTO(user, token)
      });
    } catch (error) {
      if (error.code === 'DEVICE_NOT_VERIFIED') {
        return res.status(403).json({
          success: false,
          message: error.message,
          code: 'DEVICE_NOT_VERIFIED'
        });
      }

      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await authService.getUserProfile(req.user._id);

      res.json({
        success: true,
        data: new UserWithDevicesDTO(user)
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Logout (client-side will remove token)
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}

module.exports = new AuthController();