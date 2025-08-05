import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const CategoryBreakdownChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = [
    '#2563EB', // blue-600
    '#DC2626', // red-600
    '#059669', // emerald-600
    '#D97706', // amber-600
    '#7C3AED', // violet-600
    '#DB2777', // pink-600
    '#0891B2', // cyan-600
    '#65A30D', // lime-600
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data?.category}</p>
          <p className="text-sm text-muted-foreground">
            Amount: {formatCurrency(data?.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: {data?.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div 
      className="bg-card rounded-lg border border-border p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Expense Categories</h2>
        <Icon name="PieChart" size={20} className="text-muted-foreground" />
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="amount"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS?.[index % COLORS?.length]}
                  stroke={activeIndex === index ? '#ffffff' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry?.color }} className="text-sm">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryBreakdownChart;