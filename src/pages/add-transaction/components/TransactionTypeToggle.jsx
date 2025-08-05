import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TransactionTypeToggle = ({ transactionType, onToggle }) => {
  return (
    <div className="relative bg-muted rounded-xl p-1 mb-6">
      <motion.div
        className={`absolute top-1 bottom-1 w-1/2 rounded-lg shadow-sm ${
          transactionType === 'income' ? 'bg-success' : 'bg-error'
        }`}
        initial={false}
        animate={{
          x: transactionType === 'income' ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      <div className="relative flex">
        <button
          type="button"
          onClick={() => onToggle('income')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
            transactionType === 'income' ?'text-success-foreground' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="TrendingUp" size={20} />
          <span>Income</span>
        </button>
        
        <button
          type="button"
          onClick={() => onToggle('expense')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
            transactionType === 'expense' ?'text-error-foreground' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="TrendingDown" size={20} />
          <span>Expense</span>
        </button>
      </div>
    </div>
  );
};

export default TransactionTypeToggle;