import React, { useState } from 'react';
import { savingsAPI } from '../services/api';
import { toast } from 'react-toastify';

const TransactionModal = ({ type, currentBalance, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (type === 'withdraw' && numAmount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      const apiCall = type === 'deposit' ? savingsAPI.deposit : savingsAPI.withdraw;
      const response = await apiCall({ amount: numAmount, description });

      toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      
      if (response.data.data.lowBalance) {
        toast.warning(' Your balance is now low!');
      }

      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || `${type} failed`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {type === 'deposit' ? ' Deposit' : ' Withdraw'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {type === 'withdraw' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Available Balance: <strong>RWF {currentBalance.toLocaleString()}</strong>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (RWF)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a note..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold transition ${
                type === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Processing...' : `Confirm ${type}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;