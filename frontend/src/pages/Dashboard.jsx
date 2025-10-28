import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { savingsAPI } from '../services/api';
import { toast } from 'react-toastify';
import TransactionModal from '../components/TransactionModel';
import TransactionHistory from '../components/TransactionHistory';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('deposit');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, [refreshTrigger]);

  const fetchBalance = async () => {
    try {
      const response = await savingsAPI.getBalance();
      setBalance(response.data.data.balance);
      
      if (response.data.data.lowBalance) {
        toast.warning('Your balance is low! Consider making a deposit.');
      }
    } catch (error) {
      toast.error('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleTransactionSuccess = () => {
    setShowModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName}</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-gray-500 rounded-lg shadow-lg p-8 text-white mb-8">
          <p className="text-sm opacity-90">Your Balance</p>
          <h2 className="text-5xl font-bold mt-2">{formatCurrency(balance)}</h2>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => openModal('deposit')}
              className="flex-1 bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Deposit
            </button>
            <button
              onClick={() => openModal('withdraw')}
              className="flex-1 bg-white bg-opacity-20 backdrop-blur text-white py-3 rounded-lg font-semibold hover:bg-opacity-30 transition"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <TransactionHistory refreshTrigger={refreshTrigger} />
      </main>

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          type={modalType}
          currentBalance={balance}
          onClose={() => setShowModal(false)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;