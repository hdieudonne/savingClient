import React, { useState, useEffect } from 'react';
import { savingsAPI } from '../services/api';
import { toast } from 'react-toastify';

const TransactionHistory = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger, pagination.page]);

  const fetchTransactions = async () => {
    try {
      const response = await savingsAPI.getTransactions(pagination.page);
      setTransactions(response.data.data.transactions);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-RW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `RWF ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <p className="text-gray-600">No transactions yet</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">
                        {transaction.type}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Balance: {formatCurrency(transaction.balanceAfter)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;