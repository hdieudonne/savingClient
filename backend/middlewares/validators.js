const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(15).required(),
  password: Joi.string().min(8).required(),
  deviceId: Joi.string().required(),
  deviceName: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().required()
});

const transactionSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(200).optional()
});

// Middleware to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Sanitize inputs to prevent NoSQL injection
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

module.exports = {
  validate,
  sanitizeInput,
  registerSchema,
  loginSchema,
  transactionSchema
};