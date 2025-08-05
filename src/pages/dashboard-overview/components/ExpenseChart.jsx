import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';


const ExpenseChart = ({ data }) => {
  const COLORS = [
    '#2563EB', // blue-600
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-primary font-semibold">
            ${data?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">
            {((data?.value / data?.payload?.total) * 100)?.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry?.color }}
            />
            <span className="text-sm text-muted-foreground">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!data || data?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Expense Distribution</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="PieChart" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Expense Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ExpenseChart;