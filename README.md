# Finance Track, Finance Dashboard

A full-stack finance dashboard built for tracking transactions, 
visualizing spending patterns.

**Live Demo:** [Finance Tracker](http://51.20.148.114/) | http://51.20.148.114/

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Redux Toolkit (state management)
- React Router v7
- Recharts (data visualization)
- GSAP (animations)
- Tailwind CSS + inline styles
- Vite

**Backend**
- Node.js + Express
- TypeScript
- In-memory mock data
- Deployed on AWS EC2 with Nginx


## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Run Locally

**Clone the repo**
```bash
git clone https://github.com/naveengowda7/FinanceTracker.git
cd fintrack
```

**Start the server**
```bash
cd server
npm install
npm run dev
# runs on http://localhost:3001
```

**Start the client**
```bash
cd client
npm install
npm run dev
# runs on http://localhost:5173
```

### Environment Variables

**server/.env**
PORT=3001
CLIENT_URL=http://localhost:5173

**client/.env**
VITE_API_URL=http://localhost:3001/api

## Features

### Dashboard
- summary cards with GSAP animated number 
  counters on load
- Cashflow area chart, income vs expenses over time
- Spending breakdown donut chart by category
- Credit card widget showing current balance
- Recent transactions preview (last 5)
- Upcoming payments panel (static mock)
- Budget/savings rate progress bar

### Transactions
- Full table with all 30 mock transactions
- Filter by type, category, status, month
- Live search by description, category, or note
- Sortable columns (date and amount)
- All / Income / Expense tab switcher
- CSV export of currently filtered results
- Empty state with clear filters option
- **Admin only:** Add, edit, delete transactions

### Insights
- 4 smart insight cards computed from transaction data
  (top category, month-over-month, busiest day, avg expense)
- Monthly income vs expenses bar chart
- Top 5 spending categories with progress bars

### Role Based UI
Roles are simulated on the frontend, no backend auth.

Switch roles using the toggle in the header.
Role persists in localStorage across refreshes.

### Dark / Light Mode
Full theme switching via CSS variables.
Toggle using the button in the header.

## Project Structure
<img width="617" height="485" alt="Screenshot 2026-04-06 200835" src="https://github.com/user-attachments/assets/c34ba9c5-9d32-4caa-a012-d2e5f345dffd" />

## Deployment

- **Frontend** → Nginx serving Vite build on AWS EC2
- **Backend** → Node/Express via systemd service on same EC2
- **Nginx** → acts as reverse proxy, serves frontend and forwards /api to backend on port 3001
  
