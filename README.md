# AppointEase - Appointment Scheduling Application

An appointment scheduling and management system built with Next.js.

## Features

- Provider dashboard to manage appointments and services
- User interface for booking and managing appointments
- Calendar integration for scheduling
- Chat functionality between providers and users
- Payment processing

## FullCalendar Integration

The application uses FullCalendar.js to provide advanced calendar functionality in both provider and user interfaces.

### Calendar Features:

- Multiple views (month, week, day)
- Event management with drag-and-drop functionality
- Custom event styling based on appointment status
- Template system for quick availability scheduling (provider only)
- Interactive event display

### Example Usage

#### Provider Calendar:

The provider calendar at `/provider/calendar` allows service providers to:

- View and manage appointments
- Apply availability templates to multiple days
- Select specific time slots for availability
- Drag and drop availability slots

#### User Calendar:

The user calendar at `/user/calendar` allows users to:

- View booked appointments
- Switch between month, week, and day views
- See appointment details with provider information
- Manage bookings (cancel/reschedule)

## Setup and Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Technologies

- Next.js 15.3.4
- React 19
- TailwindCSS 4
- FullCalendar.js
- TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
