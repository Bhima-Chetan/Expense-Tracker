import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import FinancialSummaryCard from './components/FinancialSummaryCard';
import ExpenseChart from './components/ExpenseChart';
import RecentTransactions from './components/RecentTransactions';
import QuickActions from './components/QuickActions';
import FloatingActionButtons from './components/FloatingActionButtons';
import { loadTransactions } from '../../utils/storage';
import { formatCurrency } from '../../utils/currency';

const DashboardOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
  });
  const [expenseData, setExpenseData] = useState([]);

  // Load transactions from localStorage with real-time updates
  useEffect(() => {
    const loadData = () => {
      const storedTransactions = loadTransactions();
      setTransactions(storedTransactions);
      
      // Calculate financial summary
      const summary = storedTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
        }
        return acc;
      }, { totalIncome: 0, totalExpenses: 0, netIncome: 0 });
      
      summary.netIncome = summary.totalIncome - summary.totalExpenses;
      setFinancialSummary(summary);
      
      // Prepare expense data for chart
      const categoryTotals = storedTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, transaction) => {
          acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
          return acc;
        }, {});
      
      const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount
      }));
      
      setExpenseData(chartData);
    };
    
    // Initial load
    loadData();
    
    // Listen for custom storage events
    const handleTransactionsUpdate = () => {
      loadData();
    };
    
    window.addEventListener('transactionsUpdated', handleTransactionsUpdate);
    
    return () => {
      window.removeEventListener('transactionsUpdated', handleTransactionsUpdate);
    };
  }, []);

  // Calculate financial summary
  useEffect(() => {
    const totalIncome = transactions?.filter(t => t?.type === 'income')?.reduce((sum, t) => sum + t?.amount, 0);
    
    const totalExpenses = transactions?.filter(t => t?.type === 'expense')?.reduce((sum, t) => sum + t?.amount, 0);
    
    const netIncome = totalIncome - totalExpenses;

    setFinancialSummary({
      totalIncome,
      totalExpenses,
      netIncome,
    });
  }, [transactions]);

  // Calculate expense distribution for chart
  useEffect(() => {
    const expensesByCategory = transactions?.filter(t => t?.type === 'expense')?.reduce((acc, transaction) => {
        const category = transaction?.category;
        acc[category] = (acc?.[category] || 0) + transaction?.amount;
        return acc;
      }, {});

    const chartData = Object.entries(expensesByCategory)?.map(([category, value]) => ({
      name: category,
      value: value,
      total: Object.values(expensesByCategory)?.reduce((sum, val) => sum + val, 0),
    }));

    setExpenseData(chartData);
  }, [transactions]);

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions]?.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back! 
            </h1>
            <p className="text-muted-foreground">
              Here's your financial overview for {new Date()?.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </motion.div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FinancialSummaryCard
              title="Total Income"
              amount={financialSummary?.totalIncome}
              icon="TrendingUp"
              color="bg-success"
              trend="up"
              trendValue="12.5"
              delay={0}
            />
            <FinancialSummaryCard
              title="Total Expenses"
              amount={financialSummary?.totalExpenses}
              icon="TrendingDown"
              color="bg-error"
              trend="down"
              trendValue="8.2"
              delay={0.1}
            />
            <FinancialSummaryCard
              title="Net Income"
              amount={financialSummary?.netIncome}
              icon="DollarSign"
              color={financialSummary?.netIncome >= 0 ? "bg-primary" : "bg-warning"}
              trend={financialSummary?.netIncome >= 0 ? "up" : "down"}
              trendValue="4.3"
              delay={0.2}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Expense Chart */}
            <div className="lg:col-span-1 xl:col-span-1">
              <ExpenseChart data={expenseData} />
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-1 xl:col-span-1">
              <RecentTransactions transactions={sortedTransactions} />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 xl:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Additional Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{transactions?.length}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {transactions?.filter(t => t?.type === 'income')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Income Entries</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold text-error">
                {transactions?.filter(t => t?.type === 'expense')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Expense Entries</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {expenseData?.length}
              </p>
              <p className="text-sm text-muted-foreground">Categories Used</p>
            </div>
          </motion.div>
        </div>
      </main>
      {/* Floating Action Buttons for Mobile */}
      <FloatingActionButtons />
    </div>
  );
};

export default DashboardOverview;