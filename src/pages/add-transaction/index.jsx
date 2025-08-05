import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import TransactionTypeToggle from './components/TransactionTypeToggle';
import TransactionForm from './components/TransactionForm';
import TransactionPreview from './components/TransactionPreview';
import SuccessAnimation from './components/SuccessAnimation';
import Icon from '../../components/AppIcon';
import { loadTransactions, addTransaction } from '../../utils/storage';
import { formatCurrency } from '../../utils/currency';

const AddTransaction = () => {
  const [transactionType, setTransactionType] = useState('expense');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  // Load current balance from localStorage
  useEffect(() => {
    const transactions = loadTransactions();
    const balance = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
    setCurrentBalance(balance);
  }, []);

  const handleTransactionTypeToggle = (type) => {
    setTransactionType(type);
  };

  const handleSubmitTransaction = async (transaction) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add transaction using storage utility
      const newTransaction = addTransaction(transaction);
      
      // Update current balance
      const newBalance = transaction.type === 'income' 
        ? currentBalance + transaction.amount 
        : currentBalance - transaction.amount;
      setCurrentBalance(newBalance);
      
      // Store last transaction for success animation
      setLastTransaction(newTransaction);
      
      // Show success animation
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setLastTransaction(null);
    
    // Don't reload the page, just reset the form
    setTransactionType('expense');
  };

  return (
    <>
      <Helmet>
        <title>Add Transaction - ExpenseTracker Pro</title>
        <meta name="description" content="Add new income or expense transactions to track your finances" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Page Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  transactionType === 'income' ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  <Icon 
                    name={transactionType === 'income' ? 'Plus' : 'Minus'} 
                    size={32}
                    color={transactionType === 'income' ? 'var(--color-success)' : 'var(--color-error)'}
                  />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Add Transaction
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Record your income and expenses to keep track of your financial health. 
                Choose the transaction type and fill in the details below.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form Section */}
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-card border border-border rounded-xl p-6 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <TransactionTypeToggle
                    transactionType={transactionType}
                    onToggle={handleTransactionTypeToggle}
                  />
                  
                  <TransactionForm
                    transactionType={transactionType}
                    onSubmit={handleSubmitTransaction}
                    isLoading={isLoading}
                  />
                </motion.div>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <TransactionPreview
                    transactionType={transactionType}
                    amount={0}
                    currentBalance={currentBalance}
                  />

                  {/* Quick Stats */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="BarChart3" size={20} />
                      <span>Quick Stats</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Balance</span>
                        <span className={`font-semibold ${
                          currentBalance >= 0 ? 'text-success' : 'text-error'
                        }`}>
                          {formatCurrency(Math.abs(currentBalance))}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Transactions</span>
                        <span className="font-semibold text-foreground">
                          {loadTransactions().length}
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                          Last updated: {new Date()?.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Tips Section */}
            <motion.div
              className="mt-8 bg-muted/50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-start space-x-3">
                <Icon name="Lightbulb" size={20} className="text-warning mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Pro Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific with descriptions to track spending patterns</li>
                    <li>• Choose the most accurate category for better analytics</li>
                    <li>• Record transactions as soon as possible for accuracy</li>
                    <li>• Use consistent naming for recurring transactions</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && lastTransaction && (
            <SuccessAnimation
              transactionType={lastTransaction?.type}
              amount={lastTransaction?.amount}
              onClose={handleCloseSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AddTransaction;