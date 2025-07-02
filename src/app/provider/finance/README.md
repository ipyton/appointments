# Provider Finance Panel

This component provides financial analytics and reporting for service providers in the appointment booking system.

## Features

- **Financial Overview**: View total revenue, pending payments, and average booking value
- **Revenue Trend**: Visual chart of monthly revenue
- **Top Services**: Bar chart showing the highest revenue-generating services
- **Recent Transactions**: Table of the latest payment activities
- **Payment Summary**: Breakdown of completed and pending payments

## Data Structure

The finance panel uses the following data structure:

```typescript
interface FinancialData {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  monthlyGrowth: number;
  averageBookingValue: number;
  topServices: {
    name: string;
    revenue: number;
    bookings: number;
  }[];
  recentTransactions: {
    id: number;
    customer: string;
    service: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending';
  }[];
  monthlyRevenue: {
    month: string;
    amount: number;
  }[];
}
```

## Future Enhancements

- Export financial reports as PDF/CSV
- Filter transactions by date range
- Payment processing integration
- Tax calculation and reporting
- Subscription revenue tracking
- Refund management 