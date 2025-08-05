import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import TimeRangeSelector from './components/TimeRangeSelector';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';
import KPICards from './components/KPICards';
import InsightsPanel from './components/InsightsPanel';
import DateRangeFilter from './components/DateRangeFilter';
import ExportReports from './components/ExportReports';
import { loadTransactions } from '../../utils/storage';
import { formatCurrency } from '../../utils/currency';

const AnalyticsDashboard = () => {
  const [selectedRange, setSelectedRange] = useState('monthly');
  const [dateRange, setDateRange] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [kpiData, setKpiData] = useState([]);

  // Load transactions from localStorage with real-time updates
  useEffect(() => {
    const loadData = () => {
      const storedTransactions = loadTransactions();
      setTransactions(storedTransactions);
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

  // Calculate analytics data from transactions
  useEffect(() => {
    if (transactions.length === 0) return;

    // Calculate monthly income vs expenses data
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { period: month, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      
      return acc;
    }, {});
    
    setIncomeExpenseData(Object.values(monthlyData));

    // Calculate category breakdown for expenses
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});
    
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }));
    
    setCategoryData(categoryBreakdown);

    // Calculate KPI data
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpensesAmount = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlySavings = totalIncome - totalExpensesAmount;
    const avgTransactionAmount = transactions.length > 0 ? 
      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0;

    const calculatedKpiData = [
      {
        id: 1,
        title: 'Monthly Savings',
        value: monthlySavings,
        type: 'currency',
        trend: monthlySavings > 0 ? 12.5 : -5.2,
        icon: 'PiggyBank',
        iconColor: 'text-success',
        bgColor: 'bg-success/10',
        description: 'vs last month'
      },
      {
        id: 2,
        title: 'Savings Rate',
        value: totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0,
        type: 'percentage',
        trend: 3.2,
        icon: 'TrendingUp',
        iconColor: 'text-accent',
        bgColor: 'bg-accent/10',
        description: 'of total income'
      },
      {
        id: 3,
        title: 'Budget Variance',
        value: -8.5,
        type: 'percentage',
        trend: -2.1,
        icon: 'Target',
        iconColor: 'text-warning',
        bgColor: 'bg-warning/10',
        description: 'under budget'
      },
      {
        id: 4,
        title: 'Avg Transaction',
        value: avgTransactionAmount,
        type: 'currency',
        trend: -5.3,
        icon: 'Calendar',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        description: 'average amount'
      }
    ];
    
    setKpiData(calculatedKpiData);
  }, [transactions]);

  // Generate insights based on transaction data
  const generateInsights = () => {
    if (transactions.length === 0) return [];
    
    const insights = [];
    const totalExpensesAmount = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Food spending insight
    const foodExpenses = transactions
      .filter(t => t.type === 'expense' && t.category === 'food')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (foodExpenses > 0 && totalExpensesAmount > 0) {
      const foodPercentage = (foodExpenses / totalExpensesAmount) * 100;
      if (foodPercentage > 25) {
        insights.push({
          id: 1,
          type: 'recommendation',
          title: 'Optimize Food Spending',
          description: `Your food expenses are ${foodPercentage.toFixed(1)}% of total spending, which is above the recommended 25%. Consider meal planning or cooking at home more often to reduce costs.`,
          action: 'View Food Budget Tips'
        });
      }
    }
    
    // Savings achievement
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome > totalExpensesAmount) {
      insights.push({
        id: 2,
        type: 'achievement',
        title: 'Great Savings Progress!',
        description: `You're saving ${((totalIncome - totalExpensesAmount) / totalIncome * 100).toFixed(1)}% of your income. Keep up the good work!`,
        action: 'View Savings Plan'
      });
    }
    
    return insights;
  };

  const insightsData = generateInsights();

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main 
        className="pt-20 pb-8 px-4 lg:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Transform your financial data into actionable insights with comprehensive reporting tools
            </p>
          </motion.div>

          {/* Time Range Selector */}
          <motion.div variants={itemVariants}>
            <TimeRangeSelector 
              selectedRange={selectedRange} 
              onRangeChange={handleRangeChange} 
            />
          </motion.div>

          {/* KPI Cards */}
          <motion.div variants={itemVariants}>
            <KPICards kpiData={kpiData} />
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <IncomeExpenseChart 
                data={incomeExpenseData} 
                selectedRange={selectedRange} 
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryBreakdownChart data={categoryData} />
            </motion.div>
          </div>

          {/* Insights and Filters Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <InsightsPanel insights={insightsData} />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <DateRangeFilter 
                onDateRangeChange={handleDateRangeChange}
                selectedRange={dateRange}
              />
              
              <ExportReports />
            </motion.div>
          </div>

          {/* Footer Info */}
          <motion.div 
            variants={itemVariants}
            className="text-center text-sm text-muted-foreground pt-8 border-t border-border"
          >
            <p>
              Data is updated in real-time. Last updated: {new Date()?.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default AnalyticsDashboard;