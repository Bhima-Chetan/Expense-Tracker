import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearFilters,
  isMobile 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Shopping', 
    'Bills', 'Healthcare', 'Education', 'Travel',
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ];

  const transactionTypes = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'amount-desc', label: 'Amount (Highest First)' },
    { value: 'amount-asc', label: 'Amount (Lowest First)' },
    { value: 'category', label: 'Category (A-Z)' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleCategoryToggle = (category) => {
    const currentCategories = localFilters?.categories || [];
    const updatedCategories = currentCategories?.includes(category)
      ? currentCategories?.filter(c => c !== category)
      : [...currentCategories, category];
    handleFilterChange('categories', updatedCategories);
  };

  const handleTypeToggle = (type) => {
    const currentTypes = localFilters?.types || [];
    const updatedTypes = currentTypes?.includes(type)
      ? currentTypes?.filter(t => t !== type)
      : [...currentTypes, type];
    handleFilterChange('types', updatedTypes);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile) onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      types: [],
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      sortBy: 'date-desc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    if (isMobile) onClose();
  };

  const panelContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Transaction Types */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Transaction Type</h4>
        <div className="space-y-2">
          {transactionTypes?.map(type => (
            <Checkbox
              key={type?.value}
              label={type?.label}
              checked={(localFilters?.types || [])?.includes(type?.value)}
              onChange={() => handleTypeToggle(type?.value)}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Categories</h4>
        <div className="grid grid-cols-2 gap-2">
          {categories?.map(category => (
            <Checkbox
              key={category}
              label={category}
              checked={(localFilters?.categories || [])?.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Date Range</h4>
        <div className="space-y-3">
          <Input
            type="date"
            label="From"
            value={localFilters?.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />
          <Input
            type="date"
            label="To"
            value={localFilters?.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>
      </div>

      {/* Amount Range */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Amount Range</h4>
        <div className="space-y-3">
          <Input
            type="number"
            label="Minimum Amount"
            placeholder="0.00"
            value={localFilters?.amountMin || ''}
            onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
          />
          <Input
            type="number"
            label="Maximum Amount"
            placeholder="10000.00"
            value={localFilters?.amountMax || ''}
            onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Sort By</h4>
        <div className="space-y-2">
          {sortOptions?.map(option => (
            <Checkbox
              key={option?.value}
              label={option?.label}
              checked={localFilters?.sortBy === option?.value}
              onChange={() => handleFilterChange('sortBy', option?.value)}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button
          onClick={applyFilters}
          className="flex-1"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-xl border-t border-border p-6 z-50 max-h-[80vh] overflow-y-auto"
            >
              {panelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border-r border-border p-6 overflow-y-auto"
        >
          {panelContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;