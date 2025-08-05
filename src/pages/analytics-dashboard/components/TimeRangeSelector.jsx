import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
  const timeRanges = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <motion.div 
      className="flex flex-wrap gap-2 p-4 bg-card rounded-lg border border-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="w-full text-sm font-medium text-muted-foreground mb-2">Time Period</h3>
      <div className="flex gap-2">
        {timeRanges?.map((range) => (
          <Button
            key={range?.value}
            variant={selectedRange === range?.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRangeChange(range?.value)}
            className="transition-all duration-200"
          >
            {range?.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default TimeRangeSelector;