import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyRevenue, MonthlyRevenue, WeeklyRevenue } from '@/types/finance';

interface RevenueChartProps {
  monthlyRevenue: MonthlyRevenue[];
  weeklyRevenue?: WeeklyRevenue[];
  dailyRevenue?: DailyRevenue[];
  dateRange: string;
  onDateRangeChange?: (dateRange: string) => void;
}

export default function RevenueChart({ 
  monthlyRevenue, 
  weeklyRevenue, 
  dailyRevenue, 
  dateRange, 
  onDateRangeChange 
}: RevenueChartProps) {
  const [chartData, setChartData] = useState<{ label: string; amount: number }[]>([]);
  const [maxValue, setMaxValue] = useState(0);

  // Update chart data when dateRange changes or data props change
  useEffect(() => {
    let newData: { label: string; amount: number }[] = [];
    let newMaxValue = 0;

    switch (dateRange) {
      case "daily":
        if (dailyRevenue) {
          newData = dailyRevenue.map(item => ({
            label: item.day,
            amount: item.amount
          }));
          newMaxValue = Math.max(...dailyRevenue.map(item => item.amount));
        }
        break;
      case "weekly":
        if (weeklyRevenue) {
          newData = weeklyRevenue.map(item => ({
            label: item.week,
            amount: item.amount
          }));
          newMaxValue = Math.max(...weeklyRevenue.map(item => item.amount));
        }
        break;
      case "monthly":
      case "quarterly":
      case "yearly":
        let dataToUse = monthlyRevenue;
        if (dateRange === "quarterly") {
          dataToUse = monthlyRevenue.filter((_, index) => index % 3 === 0);
        }
        newData = dataToUse.map(item => ({
          label: item.month,
          amount: item.amount
        }));
        newMaxValue = Math.max(...dataToUse.map(item => item.amount));
        break;
    }

    setChartData(newData);
    setMaxValue(newMaxValue);
  }, [dateRange, monthlyRevenue, weeklyRevenue, dailyRevenue]);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onDateRangeChange) {
      onDateRangeChange(e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
        <select 
          className="text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dateRange}
          onChange={handleDateRangeChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      <div className="h-64 flex items-end space-x-2 px-4">
        <AnimatePresence mode="wait">
          {chartData.map((item, index) => {
            const height = maxValue > 0 ? (item.amount / maxValue) * 100 : 0;
            
            return (
              <motion.div
                key={`${dateRange}-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.02,
                  ease: "easeOut"
                }}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                <motion.div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md shadow-sm hover:from-blue-600 hover:to-blue-500 cursor-pointer transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  style={{ height: "100%" }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium transform rotate-90 whitespace-nowrap">
                      ${item.amount}
                    </span>
                  </div>
                </motion.div>
                <motion.div 
                  className="text-xs text-gray-500 mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {dateRange} revenue data
      </div>
    </div>
  );
} 