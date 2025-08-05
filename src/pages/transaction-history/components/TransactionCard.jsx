import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionCard = ({ 
  transaction, 
  onEdit, 
  onDelete, 
  isSelected, 
  onSelect, 
  searchTerm,
  isBulkMode 
}) => {
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food': 'UtensilsCrossed',
      'Transportation': 'Car',
      'Entertainment': 'Gamepad2',
      'Shopping': 'ShoppingBag',
      'Bills': 'Receipt',
      'Healthcare': 'Heart',
      'Education': 'GraduationCap',
      'Travel': 'Plane',
      'Salary': 'Banknote',
      'Freelance': 'Briefcase',
      'Investment': 'TrendingUp',
      'Gift': 'Gift',
      'Other': 'MoreHorizontal'
    };
    return iconMap?.[category] || 'MoreHorizontal';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food': 'bg-orange-100 text-orange-600',
      'Transportation': 'bg-blue-100 text-blue-600',
      'Entertainment': 'bg-purple-100 text-purple-600',
      'Shopping': 'bg-pink-100 text-pink-600',
      'Bills': 'bg-red-100 text-red-600',
      'Healthcare': 'bg-green-100 text-green-600',
      'Education': 'bg-indigo-100 text-indigo-600',
      'Travel': 'bg-cyan-100 text-cyan-600',
      'Salary': 'bg-emerald-100 text-emerald-600',
      'Freelance': 'bg-yellow-100 text-yellow-600',
      'Investment': 'bg-teal-100 text-teal-600',
      'Gift': 'bg-rose-100 text-rose-600',
      'Other': 'bg-gray-100 text-gray-600'
    };
    return colorMap?.[category] || 'bg-gray-100 text-gray-600';
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text?.split(regex);
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = Math.abs(amount)?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return type === 'expense' ? `-${formattedAmount}` : `+${formattedAmount}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {isBulkMode && (
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-primary border-primary' :'border-border hover:border-primary'
              }`}
              onClick={() => onSelect(transaction?.id)}
            >
              {isSelected && <Icon name="Check" size={12} color="white" />}
            </div>
          )}
          
          <div className={`p-2 rounded-lg ${getCategoryColor(transaction?.category)}`}>
            <Icon name={getCategoryIcon(transaction?.category)} size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground truncate">
                {highlightText(transaction?.description, searchTerm)}
              </h3>
              <span className={`font-semibold ${
                transaction?.type === 'expense' ?'text-red-600' :'text-green-600'
              }`}>
                {formatAmount(transaction?.amount, transaction?.type)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="capitalize">{transaction?.category}</span>
                <span>•</span>
                <span>{formatDate(transaction?.date)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {!isBulkMode && (
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(transaction)}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="Edit2" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(transaction?.id)}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionCard;