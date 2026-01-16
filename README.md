# AgriSupply Hub 🌾

**Agricultural Inputs Tracker for Kenyan Farm Suppliers**

A modern, full-stack business management tool built for small-to-medium agricultural input suppliers in Kenya (fertilizers, seeds, pesticides, tools). Track inventory in real-time, record sales with automatic stock deduction, manage customers, and get actionable insights via charts and alerts — all powered by Next.js and Supabase.

Perfect for dukas, agro-vets, and wholesalers who need to know **what they sold**, **who bought it**, **when to restock**, and how much profit they're making.

Built as part of the **Pesapal  Dev Challenge '26** — showcasing clean architecture, real-world Kenyan business logic, and determination under tight deadlines.

## ✨ Features

* **Interactive Dashboard** — Today's/weekly/monthly sales, low stock alerts, total items, profit overview
* **Real-time Charts** — Stock levels (bar), sales trends over time (line) with Recharts
* **Date Range Filtering** — Filter metrics and reports (Today, 7 Days, 30 Days, All Time)
* **Inventory Management** — Add/edit/delete items, track stock levels, set low-stock thresholds
* **Smart Sales Recording** — Select item → auto-show price/stock → quantity validation → deduct stock automatically
* **Customer Tracking** — Quick add/view customers (name, phone, email) for repeat buyers
* **Payment Methods** — M-Pesa, Cash, Card, Other — Kenyan fintech ready
* **Low Stock Alerts** — Red visual warnings + highlighted items
* **Responsive & Modern UI** — Green agricultural theme (#16a34a), sidebar navigation, mobile-friendly
* **Secure & Serverless** — Supabase PostgreSQL with Row Level Security potential

## 🛠 Tech Stack

* **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
* **Database & Auth**: Supabase (PostgreSQL + optional auth)
* **Charts**: Recharts
* **Date Handling**: Native HTML5 `<input type="date">`
* **Icons**: Lucide React
* **Deployment**: Vercel (one-click from GitHub)

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm or pnpm
* Free Supabase account

### Setup in 5 Minutes

1. Clone the repo

```bash
git clone https://github.com/yourusername/agrisupply-hub.git
cd agrisupply-hub
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local` and add your Supabase credentials

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

4. Set up the database:

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

```sql
items          → id (uuid), name, stock_level, unit_price, low_threshold, created_at, updated_at
customers      → id (uuid), name, phone, email, created_at, updated_at
sales          → id (uuid), date, item_id (fk), quantity, total_amount, customer_id (fk nullable), payment_method, notes, created_at, updated_at
```

Indexes are added for date, item_id, stock_level, and name for fast queries.

## 🎯 Real-World Demo Data

The seed script includes:

* 10 common Kenyan agricultural inputs (DAP Fertilizer, Maize Seeds, Urea, Pesticides, etc.)
* 15 realistic customers (with +254 phone format)
* 120+ sales transactions from July 2025 – January 2026

→ Varying volumes, payment methods, repeat customers, seasonal patterns

## 🖥️ Usage Highlights

### Dashboard

* Real-time KPIs + charts + low stock red alerts + recent sales table

### Sales Recording

* Calendar date picker for backdating
* Stock validation (can't sell more than available)
* Auto-calculate total
* Instant stock deduction

### Inventory

* Add/edit/delete items with visual stock indicators

### Customers

* Simple CRM-like list for quick lookup during sales

## 🚀 Deployment (Vercel)

1. Push to public GitHub
2. Go to [https://vercel.com](https://vercel.com) → New Project → Import GitHub repo
3. Add environment variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — live in ~60 seconds

## ⚠️ Troubleshooting

* **No data shown** → Check env vars + run seed script
* **Hydration mismatch** → Disable browser extensions (common cause in dev)
* **Stock not deducting** → Ensure sales form has update query on submit

## 📈 Future Ideas

* User authentication + multi-user roles
* Sales receipts (PDF generation)
* Customer purchase history
* Supplier tracking
* Export reports (CSV/Excel)
* WhatsApp notifications for low stock
* M-Pesa API integration (payments)

## Built For

**Pesapal  Dev Challenge '26**
A real-world tool for Kenyan hustlers in agriculture — because good record-keeping should be as easy as M-Pesa.

Made with Next.js 16, Supabase, Tailwind, Recharts, and lots of late nights and coffee🍵.

— **Luckyantony Leshan**
