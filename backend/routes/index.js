const express = require('express');
const authController = require('../controllers/authController');
const savingsController = require('../controllers/savingsController');
const { protect, verifyDevice } = require('../middlewares/auth');
const { validate, sanitizeInput, registerSchema, loginSchema, transactionSchema } = require('../middlewares/validators');

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     TransactionInput:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication routes
 *   - name: Savings
 *     description: Savings operations
 *   - name: Health
 *     description: System monitoring
 */

/* =============================
     AUTH ROUTES
   ============================= */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/auth/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful - returns token
 */
router.post('/auth/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 */
router.get('/auth/profile', protect, verifyDevice, authController.getProfile);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/auth/logout', protect, authController.logout);


/* =============================
     SAVINGS ROUTES
   ============================= */

/**
 * @swagger
 * /savings/deposit:
 *   post:
 *     summary: Deposit money into savings
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: Amount deposited successfully
 */
router.post('/savings/deposit', protect, verifyDevice, validate(transactionSchema), savingsController.deposit);

/**
 * @swagger
 * /savings/withdraw:
 *   post:
 *     summary: Withdraw money from savings
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: Withdrawal processed successfully
 */
router.post('/savings/withdraw', protect, verifyDevice, validate(transactionSchema), savingsController.withdraw);

/**
 * @swagger
 * /savings/balance:
 *   get:
 *     summary: Get current savings balance
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returned account balance
 */
router.get('/savings/balance', protect, verifyDevice, savingsController.getBalance);

/**
 * @swagger
 * /savings/transactions:
 *   get:
 *     summary: View transaction history
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of savings transactions
 */
router.get('/savings/transactions', protect, verifyDevice, savingsController.getTransactions);


/* =============================
     HEALTH CHECK
   ============================= */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running fine
 */
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Client API is running' });
});

module.exports = router;
