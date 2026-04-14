# Midnight Slice Pizza Delivery

Full-stack pizza ordering and admin management app.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT, email verification, forgot/reset password
- Payments: Razorpay integration

## Features

- User registration and login
- Email verification flow
- Forgot password and reset password flow
- Custom pizza ordering and checkout
- Order tracking and admin order management
- Inventory management with low-stock warning email alerts to admin

## Project Structure

- backend: Express API, MongoDB models, controllers, routes
- frontend: React app and UI pages

## Prerequisites

- Node.js 18+
- MongoDB running locally or remote MongoDB URI
- Gmail App Password (for email sending)

## Environment Variables (backend/.env)

Create backend/.env with values like:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizzaDB
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin_email@gmail.com
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Notes:

- FRONTEND_URL is used in password reset emails.
- EMAIL_PASS must be a Gmail App Password.

## Installation

From project root:

```bash
npm run install:all
```

## Run (Development)

Run backend + frontend together:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Default Local URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Main Auth Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/verify/:token
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token

## Forgot Password Flow

1. User clicks Forgot password on login page.
2. Frontend calls POST /api/auth/forgot-password.
3. Backend sends reset email with link: FRONTEND_URL/reset-password/:token.
4. User sets new password on reset page.
5. Frontend calls POST /api/auth/reset-password/:token.

## Admin Low-Stock Alert

- When inventory quantity is at or below threshold, backend sends a warning email to admin recipients.
- Admin recipients come from ADMIN_EMAIL and users with role=admin.

## Scripts

Root package scripts:

- npm run dev
- npm run start
- npm run dev:backend
- npm run dev:frontend
- npm run install:all
