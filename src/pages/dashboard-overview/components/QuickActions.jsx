import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const quickActions = [
    {
      title: 'Add Income',
      description: 'Record salary, freelance, or other income',
      icon: 'TrendingUp',
      color: 'bg-success',
      link: '/add-transaction?type=income',
      delay: 0.1,
    },
    {
      title: 'Add Expense',
      description: 'Track your spending and purchases',
      icon: 'TrendingDown',
      color: 'bg-error',
      link: '/add-transaction?type=expense',
      delay: 0.2,
    },
    {
      title: 'View Analytics',
      description: 'Analyze your financial patterns',
      icon: 'BarChart3',
      color: 'bg-primary',
      link: '/analytics-dashboard',
      delay: 0.3,
    },
    {
      title: 'Transaction History',
      description: 'Browse all your transactions',
      icon: 'History',
      color: 'bg-secondary',
      link: '/transaction-history',
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action, index) => (
          <motion.div
            key={action?.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: action?.delay }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={action?.link}>
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action?.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon name={action?.icon} size={20} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {action?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action?.description}
                    </p>
                  </div>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;