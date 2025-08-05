import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const DateRangeFilter = ({ onDateRangeChange, selectedRange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);

  const quickRanges = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'This year', value: 365 }
  ];

  const handleQuickRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate?.setDate(endDate?.getDate() - days);
    
    onDateRangeChange({
      startDate: startDate?.toISOString()?.split('T')?.[0],
      endDate: endDate?.toISOString()?.split('T')?.[0]
    });
    setIsCustomRange(false);
  };

  const handleCustomRange = () => {
    if (startDate && endDate) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  const toggleCustomRange = () => {
    setIsCustomRange(!isCustomRange);
  };

  return (
    <motion.div 
      className="bg-card rounded-lg border border-border p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Date Range</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCustomRange}
          iconName={isCustomRange ? "X" : "Settings"}
          iconSize={16}
        >
          {isCustomRange ? 'Quick' : 'Custom'}
        </Button>
      </div>
      {!isCustomRange ? (
        <div className="flex flex-wrap gap-2">
          {quickRanges?.map((range) => (
            <Button
              key={range?.value}
              variant="outline"
              size="sm"
              onClick={() => handleQuickRange(range?.value)}
              className="text-xs"
            >
              {range?.label}
            </Button>
          ))}
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e?.target?.value)}
              className="text-sm"
            />
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e?.target?.value)}
              className="text-sm"
            />
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCustomRange}
            disabled={!startDate || !endDate}
            iconName="Filter"
            iconSize={16}
            className="w-full"
          >
            Apply Filter
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DateRangeFilter;