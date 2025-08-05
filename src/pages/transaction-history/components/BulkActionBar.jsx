import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionBar = ({ 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkExport,
  onCancel,
  totalCount 
}) => {
  const isAllSelected = selectedCount === totalCount;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 bg-card border border-border rounded-lg shadow-lg p-4 z-30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="CheckSquare" size={20} className="text-primary" />
                <span className="font-medium text-foreground">
                  {selectedCount} selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isAllSelected ? onDeselectAll : onSelectAll}
                  className="text-primary hover:text-primary"
                >
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkExport}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkDelete}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Delete
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                iconName="X"
                iconSize={16}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionBar;