// Currency utility functions

export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN'
};

export const formatCurrency = (amount, showSymbol = true) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  const formatted = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  return showSymbol ? formatted : formatted.replace(/[₹\s]/g, '');
};

export const formatAmount = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const parseCurrency = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  
  // Remove currency symbols and spaces, then parse
  const cleaned = value.replace(/[₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
};
