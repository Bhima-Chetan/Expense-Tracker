import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const FinancialSummaryCard = ({ title, amount, icon, color, trend, trendValue, delay = 0 }) => {

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon name={icon} size={24} color="white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span>{trendValue}%</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <motion.p
          key={amount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-foreground"
        >
          {formatCurrency(amount)}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default FinancialSummaryCard;