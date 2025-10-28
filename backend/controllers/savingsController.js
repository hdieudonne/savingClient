const savingsService = require('../services/savingsService');
const { TransactionDTO } = require('../dtos/userDTO');

class SavingsController {
  // Deposit money
  async deposit(req, res) {
    try {
      const { amount, description } = req.validatedBody;
      const userId = req.user._id;
      const deviceId = req.deviceId;

      const result = await savingsService.deposit(userId, amount, description, deviceId);

      const isLowBalance = savingsService.isBalanceLow(result.newBalance);

      res.json({
        success: true,
        message: 'Deposit successful',
        data: {
          transaction: new TransactionDTO(result.transaction),
          balance: result.newBalance,
          lowBalance: isLowBalance
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Withdraw money
  async withdraw(req, res) {
    try {
      const { amount, description } = req.validatedBody;
      const userId = req.user._id;
      const deviceId = req.deviceId;

      const result = await savingsService.withdraw(userId, amount, description, deviceId);

      const isLowBalance = savingsService.isBalanceLow(result.newBalance);

      res.json({
        success: true,
        message: 'Withdrawal successful',
        data: {
          transaction: new TransactionDTO(result.transaction),
          balance: result.newBalance,
          lowBalance: isLowBalance
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get balance
  async getBalance(req, res) {
    try {
      const userId = req.user._id;
      const balance = await savingsService.getBalance(userId);
      const isLowBalance = savingsService.isBalanceLow(balance);

      res.json({
        success: true,
        data: {
          balance,
          lowBalance: isLowBalance
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get transaction history
  async getTransactions(req, res) {
    try {
      const userId = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await savingsService.getTransactionHistory(userId, page, limit);

      res.json({
        success: true,
        data: {
          transactions: result.transactions.map(t => new TransactionDTO(t)),
          pagination: result.pagination
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new SavingsController();