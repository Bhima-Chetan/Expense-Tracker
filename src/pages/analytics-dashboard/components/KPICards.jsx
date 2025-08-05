import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const KPICards = ({ kpiData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const getIconColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData?.map((kpi, index) => (
        <motion.div
          key={kpi?.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${kpi?.bgColor}`}>
              <Icon name={kpi?.icon} size={20} className={kpi?.iconColor} />
            </div>
            <div className={`flex items-center space-x-1 ${getIconColor(kpi?.trend)}`}>
              <Icon name={getTrendIcon(kpi?.trend)} size={16} />
              <span className="text-sm font-medium">
                {Math.abs(kpi?.trend)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{kpi?.title}</h3>
            <p className="text-2xl font-bold text-foreground">
              {kpi?.type === 'currency' ? formatCurrency(kpi?.value) : `${kpi?.value}%`}
            </p>
            <p className="text-xs text-muted-foreground">{kpi?.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;