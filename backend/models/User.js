const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  devices: [{
    deviceId: {
      type: String,
      required: true
    },
    deviceName: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password using SHA-512 before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = crypto
    .createHash('sha512')
    .update(this.password)
    .digest('hex');
  
  next();
});

// Method to check if password matches
userSchema.methods.comparePassword = function(candidatePassword) {
  const hashedCandidate = crypto
    .createHash('sha512')
    .update(candidatePassword)
    .digest('hex');
  
  return hashedCandidate === this.password;
};

// Method to check if device is verified
userSchema.methods.isDeviceVerified = function(deviceId) {
  const device = this.devices.find(d => d.deviceId === deviceId);
  return device ? device.isVerified : false;
};

module.exports = mongoose.model('User', userSchema);