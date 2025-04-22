# 🚆 Train Seat Booking System

A smart seat reservation system for a train built with **Next.js**, **Node.js**, **Express**, and **PostgreSQL**. Users can register, log in, and book up to 7 seats in one go with intelligent seat allocation that prioritizes same-row seating.

---

## 📽️ Demo Video

🎥 [Click here to watch the demo video](https://drive.google.com/file/d/1MxpnjXKcy4bGG0z-mrMZ-ZShyeCILW9t/view?usp=sharing)  


---

## 🌐 Live Deployments

- **Frontend (Next.js):** [https://seat-booking-tau.vercel.app/]  
- **Backend (Express.js):** [https://seat-booking-1.onrender.com]

---

## 📝 Problem Statement

- 80 seats available in a single coach.
- 7 seats per row; the last row contains only 3 seats.
- A user can book **up to 7 seats at once**.
- Booking prioritizes **same-row seating**.
- If not available, nearest adjacent seats should be booked.
- Users must be authenticated to book seats.
- Once seats are booked, no other user can access them unless booking is reset.
- Continue booking until the coach is full.

---

## ✅ Features

- 🔐 User signup & login (JWT-based authentication)
- 🪑 Smart seat allocation logic (same-row, then nearby)
- ❌ Booking lock to prevent double booking
- 🔁 Admin-style seat reset endpoint
- 📱 Fully responsive UI with modern design
- ⚙️ Robust API with validation, sanitization & error handling
- 🧼 Clean, modular code with comments

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js (App Router), Tailwind CSS  |
| Backend   | Node.js, Express.js                 |
| Database  | PostgreSQL (Supabase)               |
| Auth      | JWT                                 |
| Deployment| Vercel (Frontend), Render (Backend) |

---

## 📂 Folder Structure
<pre> ``` train-seat-booking/
├── client/                         # Next.js Frontend
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├──login/
│   │   │   │   ├──page.js
│   │   │   ├──seats/
│   │   │   │   ├──page.js
│   │   │   ├──signup/
│   │   │   │   ├──page.js
│   │   │   ├──globals.css
│   │   │   ├──layout.js
│   │   │   ├──page.js
│   ├── components/
│   │   │   ├──ProtectedRoute.js
│   ├── hooks/
│   │   │   ├──useAuth.js
│   ├── lib/
│   │   ├──axios.js
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   └── next.config.mjs
│   └── package-lock.json
│   └── package.json
│   └── postcss.config.mjs
├── server/                         # Express Backend
│   ├── node_modules/
│   ├── controllers/
│   │   └── authController.js      # Handles signup/login logic
│   │   └── seatController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT middleware
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── authRoutes.js          # Routes for signup/login
│   │   └── seatRoutes.js
│   ├── utils/
│   │   ├── auth.js                # JWT helper functions
│   │   └── seed.js                # Seat seeding script
│   ├── db.js                      # PostgreSQL pool connection
│   ├── index.js                   # Entry point for Express app
│   ├── .env                       # Secrets like DATABASE_URL, JWT_SECRET
│   ├── package.json
│   ├── package-lock.json

 ``` </pre>

---
## 🚀 Getting Started (Local Setup)
Step 1: Clone the Repository
```bash
git clone https://github.com/SHIV5125/Seat-Booking.git
cd Seat-Booking
```

Step 2: Backend Setup (Express + PostgreSQL)
```bash
cd server
npm install
```

✅ Start the backend server:
```bash
npm start
```

Step 3: Frontend Setup (Next.js)
```bash
cd ../client
npm install
```

✅ Start the frontend app:
```bash
npm run dev
```


---
## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint      | Description            |
|--------|---------------|------------------------|
| POST   | `/api/signup` | Register new user      |
| POST   | `/api/login`  | Login & receive JWT    |

### 🪑 Seat Booking

| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| GET    | `/api/seats`              | Fetch all seat data   |
| POST   | `/api/seats/book-multiple`| Book 1 to 7 seats     |
| POST   | `/api/seats/cancel-all`   | Reset seat bookings   |

All protected routes require Authorization: Bearer <JWT> header.
---
🙋‍♂️ Author
Shivam
💻 Full Stack Developer
📧 shivamsahane5125@gmail.com

