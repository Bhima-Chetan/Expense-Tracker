import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransactionForm = ({ transactionType, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    date: new Date()?.toISOString()?.split('T')?.[0],
    description: '',
    category: '',
    amount: ''
  });
  
  const [errors, setErrors] = useState({});

  const incomeCategories = [
    { value: 'salary', label: 'Salary', icon: 'Briefcase' },
    { value: 'freelance', label: 'Freelance', icon: 'Laptop' },
    { value: 'investment', label: 'Investment', icon: 'TrendingUp' },
    { value: 'business', label: 'Business', icon: 'Building' },
    { value: 'rental', label: 'Rental Income', icon: 'Home' },
    { value: 'other-income', label: 'Other Income', icon: 'Plus' }
  ];

  const expenseCategories = [
    { value: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed' },
    { value: 'transportation', label: 'Transportation', icon: 'Car' },
    { value: 'entertainment', label: 'Entertainment', icon: 'Film' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { value: 'utilities', label: 'Utilities', icon: 'Zap' },
    { value: 'healthcare', label: 'Healthcare', icon: 'Heart' },
    { value: 'education', label: 'Education', icon: 'GraduationCap' },
    { value: 'travel', label: 'Travel', icon: 'Plane' },
    { value: 'other-expense', label: 'Other Expense', icon: 'Minus' }
  ];

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  const categoryOptions = categories?.map(cat => ({
    value: cat?.value,
    label: cat?.label,
    description: `${transactionType === 'income' ? 'Income' : 'Expense'} category`
  }));

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const transaction = {
        id: Date.now(),
        type: transactionType,
        date: formData?.date,
        description: formData?.description?.trim(),
        category: formData?.category,
        amount: parseFloat(formData?.amount),
        timestamp: new Date()?.toISOString()
      };
      
      onSubmit(transaction);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedCategory = categories?.find(cat => cat?.value === formData?.category);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Date"
          type="date"
          value={formData?.date}
          onChange={(e) => handleInputChange('date', e?.target?.value)}
          error={errors?.date}
          required
          className="w-full"
        />

        <Input
          label="Amount (₹)"
          type="number"
          placeholder="₹ 0.00"
          value={formData?.amount}
          onChange={(e) => handleInputChange('amount', e?.target?.value)}
          error={errors?.amount}
          required
          min="0.01"
          step="0.01"
          className="w-full"
        />
      </div>
      <Input
        label="Description"
        type="text"
        placeholder={`Enter ${transactionType} description`}
        value={formData?.description}
        onChange={(e) => handleInputChange('description', e?.target?.value)}
        error={errors?.description}
        required
        className="w-full"
      />
      <div className="space-y-2">
        <Select
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
          value={formData?.category}
          onChange={(value) => handleInputChange('category', value)}
          error={errors?.category}
          required
          searchable
          className="w-full"
        />
        
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3"
          >
            <Icon name={selectedCategory?.icon} size={16} />
            <span>Selected: {selectedCategory?.label}</span>
          </motion.div>
        )}
      </div>
      <motion.div
        className="pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          type="submit"
          variant={transactionType === 'income' ? 'success' : 'destructive'}
          size="lg"
          fullWidth
          loading={isLoading}
          iconName={transactionType === 'income' ? 'Plus' : 'Minus'}
          iconPosition="left"
          className="h-14 text-lg font-semibold"
        >
          {isLoading 
            ? `Adding ${transactionType}...` 
            : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`
          }
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default TransactionForm;