import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const TransactionPreview = ({ transactionType, amount, currentBalance }) => {
  const numericAmount = parseFloat(amount) || 0;
  const newBalance = transactionType === 'income' 
    ? currentBalance + numericAmount 
    : currentBalance - numericAmount;
  
  const balanceChange = newBalance - currentBalance;
  const isPositiveChange = balanceChange > 0;

  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6 mb-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Icon 
            name={transactionType === 'income' ? 'TrendingUp' : 'TrendingDown'} 
            size={24}
            color={transactionType === 'income' ? 'var(--color-success)' : 'var(--color-error)'}
          />
          <h3 className="text-lg font-semibold text-foreground">
            Transaction Preview
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(currentBalance)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {transactionType === 'income' ? 'Adding' : 'Subtracting'}
            </p>
            <motion.p
              className={`text-xl font-semibold ${
                transactionType === 'income' ? 'text-success' : 'text-error'
              }`}
              key={numericAmount}
              initial={{ scale: 1 }}
              animate={{ scale: numericAmount > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {transactionType === 'income' ? '+' : '-'}
              {formatCurrency(numericAmount)}
            </motion.p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">New Balance</p>
            <motion.p
              className={`text-xl font-semibold ${
                isPositiveChange ? 'text-success' : 'text-error'
              }`}
              key={newBalance}
              initial={{ scale: 1 }}
              animate={{ scale: numericAmount > 0 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {formatCurrency(newBalance)}
            </motion.p>
          </div>
        </div>

        {numericAmount > 0 && (
          <motion.div
            className={`flex items-center justify-center space-x-2 text-sm ${
              isPositiveChange ? 'text-success' : 'text-error'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Icon 
              name={isPositiveChange ? 'ArrowUp' : 'ArrowDown'} 
              size={16} 
            />
            <span>
              Balance will {isPositiveChange ? 'increase' : 'decrease'} by {formatCurrency(Math.abs(balanceChange))}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionPreview;