import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import TransactionCard from './components/TransactionCard';
import FilterPanel from './components/FilterPanel';
import BulkActionBar from './components/BulkActionBar';
import TransactionTable from './components/TransactionTable';
import EditTransactionModal from './components/EditTransactionModal';
import { loadTransactions } from '../../utils/storage';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    sortBy: 'date-desc'
  });

  // Load transactions from localStorage with real-time updates
  useEffect(() => {
    const loadData = () => {
      const storedTransactions = loadTransactions();
      setTransactions(storedTransactions);
    };
    
    // Initial load
    loadData();
    
    // Listen for custom storage events
    const handleTransactionsUpdate = () => {
      loadData();
    };
    
    window.addEventListener('transactionsUpdated', handleTransactionsUpdate);
    
    return () => {
      window.removeEventListener('transactionsUpdated', handleTransactionsUpdate);
    };
  }, []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions?.filter(transaction => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm?.toLowerCase();
        if (!transaction?.description?.toLowerCase()?.includes(searchLower) &&
            !transaction?.category?.toLowerCase()?.includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters?.categories?.length > 0 && !filters?.categories?.includes(transaction?.category)) {
        return false;
      }

      // Type filter
      if (filters?.types?.length > 0 && !filters?.types?.includes(transaction?.type)) {
        return false;
      }

      // Date range filter
      if (filters?.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters?.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) {
        return false;
      }

      // Amount range filter
      if (filters?.amountMin && Math.abs(transaction?.amount) < parseFloat(filters?.amountMin)) {
        return false;
      }
      if (filters?.amountMax && Math.abs(transaction?.amount) > parseFloat(filters?.amountMax)) {
        return false;
      }

      return true;
    });

    // Sort transactions
    filtered?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = Math.abs(a?.amount);
          bValue = Math.abs(b?.amount);
          break;
        case 'category':
          aValue = a?.category?.toLowerCase();
          bValue = b?.category?.toLowerCase();
          break;
        case 'description':
          aValue = a?.description?.toLowerCase();
          bValue = b?.description?.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, filters, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e?.target?.value);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      types: [],
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      sortBy: 'date-desc'
    });
  };

  const handleBulkModeToggle = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedTransactions([]);
  };

  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev => 
      prev?.includes(transactionId)
        ? prev?.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTransactions(filteredTransactions?.map(t => t?.id));
  };

  const handleDeselectAll = () => {
    setSelectedTransactions([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTransactions?.length} transactions?`)) {
      const updatedTransactions = transactions?.filter(t => !selectedTransactions?.includes(t?.id));
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTracker_transactions', JSON.stringify(updatedTransactions));
      setSelectedTransactions([]);
      setIsBulkMode(false);
    }
  };

  const handleBulkExport = () => {
    const selectedData = transactions?.filter(t => selectedTransactions?.includes(t?.id));
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...selectedData?.map(t => [
        t?.date,
        t?.description,
        t?.category,
        t?.type,
        t?.amount
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTransaction) => {
    const updatedTransactions = transactions?.map(t => 
      t?.id === updatedTransaction?.id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('expenseTracker_transactions', JSON.stringify(updatedTransactions));
  };

  const handleDelete = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions?.filter(t => t?.id !== transactionId);
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTracker_transactions', JSON.stringify(updatedTransactions));
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <>
      <Helmet>
        <title>Transaction History - ExpenseTracker Pro</title>
        <meta name="description" content="View and manage all your financial transactions with powerful filtering and search capabilities." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="pt-16">
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Filter Panel - Desktop */}
            {!isMobile && (
              <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                isMobile={false}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Sub Header */}
              <div className="bg-card border-b border-border p-4 lg:p-6">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
                    <p className="text-muted-foreground mt-1">
                      {filteredTransactions?.length} of {transactions?.length} transactions
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Search */}
                    <div className="relative flex-1 lg:w-80">
                      <Icon 
                        name="Search" 
                        size={20} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                      />
                      <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10"
                      />
                    </div>

                    {/* Filter Button */}
                    <Button
                      variant={isFilterOpen ? "default" : "outline"}
                      onClick={handleFilterToggle}
                      iconName="Filter"
                      iconPosition="left"
                      iconSize={18}
                    >
                      Filters
                    </Button>

                    {/* View Mode Toggle - Desktop */}
                    {!isMobile && (
                      <div className="flex items-center border border-border rounded-lg p-1">
                        <Button
                          variant={viewMode === 'cards' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('cards')}
                          iconName="LayoutGrid"
                          iconSize={16}
                        />
                        <Button
                          variant={viewMode === 'table' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('table')}
                          iconName="Table"
                          iconSize={16}
                        />
                      </div>
                    )}

                    {/* Bulk Mode Toggle */}
                    <Button
                      variant={isBulkMode ? "default" : "outline"}
                      onClick={handleBulkModeToggle}
                      iconName="CheckSquare"
                      iconPosition="left"
                      iconSize={18}
                    >
                      {isBulkMode ? 'Cancel' : 'Select'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-auto p-4 lg:p-6">
                <AnimatePresence mode="wait">
                  {viewMode === 'cards' || isMobile ? (
                    <motion.div
                      key="cards"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {filteredTransactions?.length > 0 ? (
                        filteredTransactions?.map((transaction) => (
                          <div key={transaction?.id} className="group">
                            <TransactionCard
                              transaction={transaction}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              isSelected={selectedTransactions?.includes(transaction?.id)}
                              onSelect={handleSelectTransaction}
                              searchTerm={searchTerm}
                              isBulkMode={isBulkMode}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Icon name="FileX" size={64} className="text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-medium text-foreground mb-2">No transactions found</h3>
                          <p className="text-muted-foreground mb-6">
                            {searchTerm || Object.values(filters)?.some(f => f?.length > 0 || f !== '')
                              ? 'Try adjusting your filters or search terms.' :'Start by adding your first transaction.'}
                          </p>
                          <Button
                            onClick={() => window.location.href = '/add-transaction'}
                            iconName="Plus"
                            iconPosition="left"
                          >
                            Add Transaction
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <TransactionTable
                        transactions={filteredTransactions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selectedTransactions={selectedTransactions}
                        onSelectTransaction={handleSelectTransaction}
                        onSelectAll={handleSelectAll}
                        isBulkMode={isBulkMode}
                        searchTerm={searchTerm}
                        onSort={handleSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {isMobile && (
            <FilterPanel
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isMobile={true}
            />
          )}

          {/* Bulk Action Bar */}
          <BulkActionBar
            selectedCount={selectedTransactions?.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkDelete={handleBulkDelete}
            onBulkExport={handleBulkExport}
            onCancel={() => {
              setIsBulkMode(false);
              setSelectedTransactions([]);
            }}
            totalCount={filteredTransactions?.length}
          />

          {/* Edit Transaction Modal */}
          <EditTransactionModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingTransaction(null);
            }}
            transaction={editingTransaction}
            onSave={handleSaveEdit}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;