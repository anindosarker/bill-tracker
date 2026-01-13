This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Bill Attendance Tracker

A web application for tracking worker bills and attendance with authentication.

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- pnpm (or npm/yarn)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
# Get your connection string from MongoDB Atlas or your local MongoDB instance
MONGODB_URI=mongodb://localhost:27017/bill-attendance
# Example for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bill-attendance?retryWrites=true&w=majority

# NextAuth Configuration
# Generate a secret with: openssl rand -base64 32
# Or use any random string for development
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# NextAuth URL
# For local development, use: http://localhost:3000
# For production, use your actual domain: https://yourdomain.com
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up your environment variables (see above)

3. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### First Time Setup

1. Navigate to the homepage (login page)
2. Click "Don't have an account? Sign up" to create your first account
3. After registration, login with your credentials
4. You'll be redirected to the dashboard where you can create and manage bills

## Features

- User authentication with email/password
- Protected dashboard routes
- Create, edit, and print bills
- Track worker attendance and payments
- Bill version history

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
