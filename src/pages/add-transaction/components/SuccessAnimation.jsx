import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SuccessAnimation = ({ transactionType, amount, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card rounded-2xl p-8 mx-4 max-w-md w-full text-center shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.div
          className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            transactionType === 'income' ? 'bg-success/10' : 'bg-error/10'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 600 }}
          >
            <Icon 
              name="CheckCircle" 
              size={48} 
              color={transactionType === 'income' ? 'var(--color-success)' : 'var(--color-error)'}
            />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Transaction Added!
        </motion.h2>

        <motion.p
          className="text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your {transactionType} of ${parseFloat(amount)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been successfully recorded.
        </motion.p>

        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onClose}
            className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Add Another
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = '/dashboard-overview';
            }}
            className="flex-1 bg-muted text-foreground py-3 px-4 rounded-lg font-medium hover:bg-muted/80 transition-colors duration-200"
          >
            View Dashboard
          </button>
        </motion.div>

        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)]?.map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                transactionType === 'income' ? 'bg-success' : 'bg-error'
              }`}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: 0.6 + i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessAnimation;