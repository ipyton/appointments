"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { FinancialData, TransactionStatus } from "@/types/finance";

export default function ProviderFinancePage() {
  const [dateRange, setDateRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);

  // Mock financial data - would be replaced with real API calls
  const financialData: FinancialData = {
    totalRevenue: 4250.00,
    pendingPayments: 750.00,
    completedPayments: 3500.00,
    monthlyGrowth: 12.5,
    averageBookingValue: 85.00,
    topServices: [
      { name: "Consultation", revenue: 1200, bookings: 15 },
      { name: "Follow-up", revenue: 800, bookings: 10 },
      { name: "Premium Service", revenue: 1500, bookings: 5 },
      { name: "Basic Service", revenue: 750, bookings: 15 },
    ],
    recentTransactions: [
      { id: 1, customer: "John Doe", service: "Consultation", amount: 80.00, date: "2023-10-15", status: "completed" as TransactionStatus },
      { id: 2, customer: "Jane Smith", service: "Premium Service", amount: 300.00, date: "2023-10-14", status: "completed" as TransactionStatus },
      { id: 3, customer: "Mike Johnson", service: "Follow-up", amount: 60.00, date: "2023-10-13", status: "pending" as TransactionStatus },
      { id: 4, customer: "Sarah Williams", service: "Basic Service", amount: 50.00, date: "2023-10-12", status: "completed" as TransactionStatus },
      { id: 5, customer: "Robert Brown", service: "Consultation", amount: 80.00, date: "2023-10-10", status: "pending" as TransactionStatus },
    ],
    monthlyRevenue: [
      { month: "Jan", amount: 2100 },
      { month: "Feb", amount: 2400 },
      { month: "Mar", amount: 1800 },
      { month: "Apr", amount: 2200 },
      { month: "May", amount: 2600 },
      { month: "Jun", amount: 3100 },
      { month: "Jul", amount: 3400 },
      { month: "Aug", amount: 3200 },
      { month: "Sep", amount: 3800 },
      { month: "Oct", amount: 4250 },
    ]
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2">
            <select 
              className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <button 
            onClick={refreshData}
            className="flex items-center justify-center p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">${financialData.totalRevenue.toFixed(2)}</h3>
            </div>
            <span className="bg-green-100 p-2 rounded-lg text-green-600">
              <CurrencyDollarIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-green-600">
            <ArrowUpIcon className="h-3 w-3 mr-1" />
            <span>{financialData.monthlyGrowth}% from last month</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Payments</p>
              <h3 className="text-2xl font-bold text-gray-900">${financialData.pendingPayments.toFixed(2)}</h3>
            </div>
            <span className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
              <CreditCardIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-yellow-600">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Expected within 7 days</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Average Booking Value</p>
              <h3 className="text-2xl font-bold text-gray-900">${financialData.averageBookingValue.toFixed(2)}</h3>
            </div>
            <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <ChartBarIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-blue-600">
            <ArrowUpIcon className="h-3 w-3 mr-1" />
            <span>5% from last month</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
        <div className="h-64 flex items-end space-x-2">
          {financialData.monthlyRevenue.map((item, index) => {
            const height = (item.amount / 5000) * 100; // Scale to percentage of max height
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{item.month}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top Services and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-medium text-lg">Top Services by Revenue</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {financialData.topServices.map((service, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">${service.revenue}</span>
                      <span className="text-xs text-gray-500 ml-2">({service.bookings} bookings)</span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                    <div 
                      style={{ width: `${(service.revenue / 1500) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-medium text-lg">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {transaction.status === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Payment Summary */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-lg font-semibold">${financialData.completedPayments.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-semibold">${financialData.pendingPayments.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <DocumentChartBarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-lg font-semibold">${financialData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 