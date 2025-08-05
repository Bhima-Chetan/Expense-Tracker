import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const InsightsPanel = ({ insights }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'recommendation':
        return 'Lightbulb';
      case 'alert':
        return 'AlertTriangle';
      case 'achievement':
        return 'Trophy';
      default:
        return 'Info';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'recommendation':
        return 'text-accent';
      case 'alert':
        return 'text-warning';
      case 'achievement':
        return 'text-success';
      default:
        return 'text-primary';
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'recommendation':
        return 'bg-accent/10';
      case 'alert':
        return 'bg-warning/10';
      case 'achievement':
        return 'bg-success/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <motion.div 
      className="bg-card rounded-lg border border-border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Brain" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">AI Insights</h2>
      </div>
      <div className="space-y-4">
        {insights?.map((insight, index) => (
          <motion.div
            key={insight?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getBgColor(insight?.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getBgColor(insight?.type)}`}>
                <Icon 
                  name={getInsightIcon(insight?.type)} 
                  size={16} 
                  className={getInsightColor(insight?.type)} 
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {insight?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight?.description}
                </p>
                {insight?.action && (
                  <button className="mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    {insight?.action}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InsightsPanel;