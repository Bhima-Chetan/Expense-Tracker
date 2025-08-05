import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })?.format(Math.abs(amount));
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': 'UtensilsCrossed',
      'Transportation': 'Car',
      'Entertainment': 'Gamepad2',
      'Shopping': 'ShoppingBag',
      'Bills & Utilities': 'Receipt',
      'Healthcare': 'Heart',
      'Education': 'GraduationCap',
      'Travel': 'Plane',
      'Salary': 'Briefcase',
      'Freelance': 'Laptop',
      'Investment': 'TrendingUp',
      'Gift': 'Gift',
      'Other': 'MoreHorizontal',
    };
    return iconMap?.[category] || 'MoreHorizontal';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food & Dining': 'bg-orange-500',
      'Transportation': 'bg-blue-500',
      'Entertainment': 'bg-purple-500',
      'Shopping': 'bg-pink-500',
      'Bills & Utilities': 'bg-yellow-500',
      'Healthcare': 'bg-red-500',
      'Education': 'bg-indigo-500',
      'Travel': 'bg-cyan-500',
      'Salary': 'bg-green-500',
      'Freelance': 'bg-emerald-500',
      'Investment': 'bg-teal-500',
      'Gift': 'bg-rose-500',
      'Other': 'bg-gray-500',
    };
    return colorMap?.[category] || 'bg-gray-500';
  };

  if (!transactions || transactions?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <Link to="/transaction-history">
            <Button variant="ghost" size="sm">
              View All
              <Icon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No transactions yet</p>
            <Link to="/add-transaction">
              <Button variant="outline" size="sm" className="mt-2">
                Add Transaction
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <Link to="/transaction-history">
          <Button variant="ghost" size="sm">
            View All
            <Icon name="ArrowRight" size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {transactions?.slice(0, 5)?.map((transaction, index) => (
          <motion.div
            key={transaction?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <div className={`p-2 rounded-lg ${getCategoryColor(transaction?.category)}`}>
              <Icon name={getCategoryIcon(transaction?.category)} size={16} color="white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {transaction?.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction?.category} • {formatDate(transaction?.date)}
              </p>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-semibold ${
                transaction?.type === 'income' ? 'text-success' : 'text-error'
              }`}>
                {transaction?.type === 'income' ? '+' : '-'}{formatCurrency(transaction?.amount)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Link to="/add-transaction">
          <Button variant="outline" fullWidth>
            <Icon name="Plus" size={16} className="mr-2" />
            Add New Transaction
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default RecentTransactions;