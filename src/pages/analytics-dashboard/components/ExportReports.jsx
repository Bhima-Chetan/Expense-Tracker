import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { loadTransactions } from '../../../utils/storage';
import { formatCurrency } from '../../../utils/currency';

const ExportReports = ({ onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportType, setExportType] = useState('summary');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'json', label: 'JSON Data' }
  ];

  const typeOptions = [
    { value: 'summary', label: 'Summary Report' },
    { value: 'detailed', label: 'Detailed Analysis' },
    { value: 'transactions', label: 'Transaction History' },
    { value: 'categories', label: 'Category Breakdown' }
  ];

  const generateCSV = (transactions) => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const generateJSON = (transactions) => {
    const summary = transactions.reduce((acc, t) => {
      if (t.type === 'income') {
        acc.totalIncome += t.amount;
      } else {
        acc.totalExpenses += t.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });
    
    summary.netIncome = summary.totalIncome - summary.totalExpenses;
    
    return JSON.stringify({
      summary,
      transactions,
      exportDate: new Date().toISOString(),
      totalTransactions: transactions.length
    }, null, 2);
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const transactions = loadTransactions();
      const date = new Date().toISOString().split('T')[0];
      
      if (exportFormat === 'csv') {
        const csvContent = generateCSV(transactions);
        downloadFile(csvContent, `transactions-${exportType}-${date}.csv`, 'text/csv');
      } else if (exportFormat === 'json') {
        const jsonContent = generateJSON(transactions);
        downloadFile(jsonContent, `transactions-${exportType}-${date}.json`, 'application/json');
      } else if (exportFormat === 'pdf') {
        // For PDF, we'll create a simple HTML report that can be printed as PDF
        const htmlContent = generateHTMLReport(transactions);
        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.print();
      } else {
        alert('Export format not yet implemented. Use CSV or JSON for now.');
      }
      
      // Call the parent handler if provided
      if (onExport) {
        onExport({ format: exportFormat, type: exportType });
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateHTMLReport = (transactions) => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Financial Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 30px; }
            .summary-item { display: flex; justify-content: space-between; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Financial Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h2>Summary</h2>
            <div class="summary-item">
              <span>Total Income:</span>
              <span class="income">${formatCurrency(totalIncome)}</span>
            </div>
            <div class="summary-item">
              <span>Total Expenses:</span>
              <span class="expense">${formatCurrency(totalExpenses)}</span>
            </div>
            <div class="summary-item">
              <span>Net Income:</span>
              <span class="${netIncome >= 0 ? 'income' : 'expense'}">${formatCurrency(Math.abs(netIncome))}</span>
            </div>
          </div>
          
          <h2>Transaction Details</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td>${t.description}</td>
                  <td>${t.category}</td>
                  <td class="${t.type}">${t.type}</td>
                  <td class="${t.type}">${formatCurrency(t.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  return (
    <motion.div 
      className="bg-card rounded-lg border border-border p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Download" size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Export Reports</h2>
      </div>
      <div className="space-y-4">
        <Select
          label="Export Format"
          options={formatOptions}
          value={exportFormat}
          onChange={setExportFormat}
        />
        
        <Select
          label="Report Type"
          options={typeOptions}
          value={exportType}
          onChange={setExportType}
        />
        
        <Button
          variant="default"
          onClick={handleExport}
          loading={isExporting}
          iconName="FileDown"
          iconPosition="left"
          className="w-full"
        >
          {isExporting ? 'Generating Report...' : 'Export Report'}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center">
          Reports include data from your selected time range and filters
        </div>
      </div>
    </motion.div>
  );
};

export default ExportReports;