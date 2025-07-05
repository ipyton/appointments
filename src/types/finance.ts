export type TransactionStatus = 'completed' | 'pending' | 'refunded' | 'failed';

export interface ServiceRevenue {
  name: string;
  revenue: number;
  bookings: number;
}

export interface Transaction {
  id: number;
  customer: string;
  customerId?: string;
  service: string;
  serviceId?: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export interface WeeklyRevenue {
  week: string;
  amount: number;
}

export interface DailyRevenue {
  day: string;
  amount: number;
}

export interface FinancialData {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  monthlyGrowth: number;
  averageBookingValue: number;
  topServices: ServiceRevenue[];
  recentTransactions: Transaction[];
  monthlyRevenue: MonthlyRevenue[];
  weeklyRevenue?: WeeklyRevenue[];
  dailyRevenue?: DailyRevenue[];
}

export interface FinancialFilter {
  startDate?: Date;
  endDate?: Date;
  status?: TransactionStatus[];
  services?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface FinancialReport {
  title: string;
  dateGenerated: Date;
  dateRange: {
    start: Date;
    end: Date;
  };
  data: FinancialData;
  filters?: FinancialFilter;
} 