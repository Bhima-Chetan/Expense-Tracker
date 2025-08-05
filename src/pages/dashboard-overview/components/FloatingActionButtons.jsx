import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const FloatingActionButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 md:hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to="/add-transaction?type=income">
          <div className="w-14 h-14 bg-success rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
            <Icon name="Plus" size={24} color="white" />
          </div>
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to="/add-transaction?type=expense">
          <div className="w-14 h-14 bg-error rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
            <Icon name="Minus" size={24} color="white" />
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default FloatingActionButtons;