// Storage utility for managing transactions

export const STORAGE_KEY = 'expensetracker_transactions';

export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('transactionsUpdated', {
      detail: { transactions }
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving transactions:', error);
    return false;
  }
};

export const loadTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const addTransaction = (transaction) => {
  const transactions = loadTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now() + Math.random(), // Ensure unique ID
    timestamp: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const deleteTransaction = (id) => {
  const transactions = loadTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
  return filtered;
};

export const updateTransaction = (id, updates) => {
  const transactions = loadTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
    return transactions[index];
  }
  
  return null;
};

export const clearAllTransactions = () => {
  saveTransactions([]);
};

export const initializeApp = () => {
  // For a fresh start, we can clear existing data
  // Comment out the line below if you want to keep existing data
  // clearAllTransactions();
};
