import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const EditTransactionModal = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Shopping', 
    'Bills', 'Healthcare', 'Education', 'Travel',
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction?.description || '',
        amount: Math.abs(transaction?.amount)?.toString() || '',
        category: transaction?.category || '',
        type: transaction?.type || 'expense',
        date: transaction?.date || ''
      });
    }
  }, [transaction]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    const updatedTransaction = {
      ...transaction,
      description: formData?.description?.trim(),
      amount: parseFloat(formData?.amount),
      category: formData?.category,
      type: formData?.type,
      date: formData?.date,
      updatedAt: new Date()?.toISOString()
    };

    onSave(updatedTransaction);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Edit Transaction
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Description"
                  type="text"
                  placeholder="Enter transaction description"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  error={errors?.description}
                  required
                />

                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData?.amount}
                  onChange={(e) => handleInputChange('amount', e?.target?.value)}
                  error={errors?.amount}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories?.map(category => (
                      <Checkbox
                        key={category}
                        label={category}
                        checked={formData?.category === category}
                        onChange={() => handleInputChange('category', category)}
                        size="sm"
                      />
                    ))}
                  </div>
                  {errors?.category && (
                    <p className="mt-1 text-sm text-red-600">{errors?.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Transaction Type
                  </label>
                  <div className="flex space-x-4">
                    <Checkbox
                      label="Income"
                      checked={formData?.type === 'income'}
                      onChange={() => handleInputChange('type', 'income')}
                    />
                    <Checkbox
                      label="Expense"
                      checked={formData?.type === 'expense'}
                      onChange={() => handleInputChange('type', 'expense')}
                    />
                  </div>
                </div>

                <Input
                  label="Date"
                  type="date"
                  value={formData?.date}
                  onChange={(e) => handleInputChange('date', e?.target?.value)}
                  error={errors?.date}
                  required
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditTransactionModal;