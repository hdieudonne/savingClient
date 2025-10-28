const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

class SavingsService {
  // Deposit money
  async deposit(userId, amount, description, deviceId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      
      if (!user) {
        throw new Error('User not found');
      }

      const balanceBefore = user.balance;
      user.balance += amount;
      const balanceAfter = user.balance;

      await user.save({ session });

      // Create transaction record
      const transaction = await Transaction.create([{
        userId,
        type: 'deposit',
        amount,
        balanceBefore,
        balanceAfter,
        description: description || 'Deposit',
        deviceId,
        status: 'success'
      }], { session });

      await session.commitTransaction();
      
      return {
        transaction: transaction[0],
        newBalance: balanceAfter
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Withdraw money
  async withdraw(userId, amount, description, deviceId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Check if sufficient balance
      if (user.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const balanceBefore = user.balance;
      user.balance -= amount;
      const balanceAfter = user.balance;

      await user.save({ session });

      // Create transaction record
      const transaction = await Transaction.create([{
        userId,
        type: 'withdraw',
        amount,
        balanceBefore,
        balanceAfter,
        description: description || 'Withdrawal',
        deviceId,
        status: 'success'
      }], { session });

      await session.commitTransaction();
      
      return {
        transaction: transaction[0],
        newBalance: balanceAfter
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get transaction history
  async getTransactionHistory(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId });

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get account balance
  async getBalance(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.balance;
  }

  // Check if balance is low (below 1000)
  isBalanceLow(balance) {
    return balance < 1000;
  }
}

module.exports = new SavingsService();