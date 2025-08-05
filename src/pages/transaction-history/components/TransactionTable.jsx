import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  selectedTransactions,
  onSelectTransaction,
  onSelectAll,
  isBulkMode,
  searchTerm,
  onSort,
  sortBy,
  sortOrder 
}) => {
  const [editingId, setEditingId] = useState(null);

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
      'Food': 'text-orange-600',
      'Transportation': 'text-blue-600',
      'Entertainment': 'text-purple-600',
      'Shopping': 'text-pink-600',
      'Bills': 'text-red-600',
      'Healthcare': 'text-green-600',
      'Education': 'text-indigo-600',
      'Travel': 'text-cyan-600',
      'Salary': 'text-emerald-600',
      'Freelance': 'text-yellow-600',
      'Investment': 'text-teal-600',
      'Gift': 'text-rose-600',
      'Other': 'text-gray-600'
    };
    return colorMap?.[category] || 'text-gray-600';
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

  const handleSort = (column) => {
    onSort(column);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = selectedTransactions?.length === transactions?.length && transactions?.length > 0;
  const isIndeterminate = selectedTransactions?.length > 0 && selectedTransactions?.length < transactions?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {isBulkMode && (
                <th className="w-12 px-4 py-3 text-left">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      isAllSelected 
                        ? 'bg-primary border-primary' 
                        : isIndeterminate
                        ? 'bg-primary/50 border-primary' :'border-border hover:border-primary'
                    }`}
                    onClick={onSelectAll}
                  >
                    {isAllSelected && <Icon name="Check" size={12} color="white" />}
                    {isIndeterminate && <Icon name="Minus" size={12} color="white" />}
                  </div>
                </th>
              )}
              
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('date')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                  iconName={getSortIcon('date')}
                  iconPosition="right"
                  iconSize={16}
                >
                  Date
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('description')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                  iconName={getSortIcon('description')}
                  iconPosition="right"
                  iconSize={16}
                >
                  Description
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('category')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                  iconName={getSortIcon('category')}
                  iconPosition="right"
                  iconSize={16}
                >
                  Category
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <span className="font-medium text-muted-foreground">Type</span>
              </th>
              
              <th className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('amount')}
                  className="font-medium text-muted-foreground hover:text-foreground"
                  iconName={getSortIcon('amount')}
                  iconPosition="right"
                  iconSize={16}
                >
                  Amount
                </Button>
              </th>
              
              {!isBulkMode && (
                <th className="w-24 px-4 py-3 text-center">
                  <span className="font-medium text-muted-foreground">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {transactions?.map((transaction, index) => (
              <motion.tr
                key={transaction?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-muted/30 transition-colors ${
                  selectedTransactions?.includes(transaction?.id) 
                    ? 'bg-primary/5 border-l-4 border-l-primary' :''
                }`}
              >
                {isBulkMode && (
                  <td className="px-4 py-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        selectedTransactions?.includes(transaction?.id)
                          ? 'bg-primary border-primary' :'border-border hover:border-primary'
                      }`}
                      onClick={() => onSelectTransaction(transaction?.id)}
                    >
                      {selectedTransactions?.includes(transaction?.id) && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </div>
                  </td>
                )}
                
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(transaction?.date)}
                </td>
                
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">
                    {highlightText(transaction?.description, searchTerm)}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getCategoryIcon(transaction?.category)} 
                      size={16} 
                      className={getCategoryColor(transaction?.category)}
                    />
                    <span className="text-sm text-muted-foreground capitalize">
                      {transaction?.category}
                    </span>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction?.type === 'income' ?'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                  }`}>
                    {transaction?.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${
                    transaction?.type === 'expense' ?'text-red-600' :'text-green-600'
                  }`}>
                    {formatAmount(transaction?.amount, transaction?.type)}
                  </span>
                </td>
                
                {!isBulkMode && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name="Edit2" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction?.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms to find transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;