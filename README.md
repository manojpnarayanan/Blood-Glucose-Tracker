Sweety — Blood Glucose Tracker

A production-grade full-stack web application designed for diabetes patients to record up to 4 daily blood glucose readings, monitor trends, and generate comprehensive daily and monthly analytical reports.

Built with the PERN Stack (PostgreSQL, Express.js, React, Node.js) following the enterprise Repository Pattern and secure session management.


Features
1. Authentication & Security
Secure Registration & Login: Passwords hashed using bcrypt (salt factor 10).
httpOnly Cookies: JWT tokens delivered strictly via httpOnly, sameSite cookies (immune to XSS and client-side token extraction).
Patient Isolation: All database queries strictly scoped to authenticated req.user.id.
2. Blood Glucose Tracking (CRUD)
Track up to 4 standardized daily time slots:
🌅 Morning (fasting)
🥪 After breakfast
🍱 After lunch
🌙 After dinner
Custom in-app confirmation dialogs for safe record edits and deletions.
3. Business Validation Rules

Enforces all 5 strict business constraints with clear, patient-friendly UI alerts:

Constraint	UI Error Message
Value required	"Please enter a glucose value."
Range validation (40–600 mg/dl)	"Value must be between 40 and 600 mg/dl."
Duplicate slot per day	"You already have an [slot] reading for this date."
Daily slot limit	"You can add only 4 readings per day."
Chronological check	"Date cannot be in the future."
4. Analytics & Reports
Daily Report: Granular slot-by-slot breakdown for any chosen date.
Month-to-Date (MTD): Trend analysis from the 1st of the month to selected date.
Previous Month: Full calendar analysis of the entire preceding month.
Statistics: Computes Highest, Lowest, Average (rounded to 1 decimal place), and Total count. Includes empty-state screens for zero-reading periods.
5. Bonus Feature Implemented
Pagination: Implemented with ?page=1&limit=10 query support across report queries and ?page=1&limit=20 on reading endpoints with dynamic pagination controls in the UI.


Architecture & Directory Structure

Follows the enterprise Repository Pattern (Separation of Concerns):

HTTP Request ➔ Controller ➔ Service (Business Logic) ➔ Repository (SQL Query) ➔ PostgreSQL

Blood-Glucose-Tracker/ ├── backend/ │ ├── src/ │ │ ├── config/ # PostgreSQL connection pool (pg.Pool) │ │ ├── controllers/ # Request/Response HTTP transport layer │ │ ├── middleware/ # JWT auth guard & centralized error handling │ │ ├── repositories/ # Pure SQL queries and DB operations │ │ ├── routes/ # Express route declarations │ │ ├── schema/ # DDL schema definition, initdb & demo seeder │ │ ├── services/ # Business logic, validations, statistics calculations │ │ ├── app.js # Express app configuration & middleware pipeline │ │ └── server.js # Server bootstrapping │ └── tests/ # Automated unit & integration tests │ └── frontend/ ├── src/ │ ├── api/ # Centralized API service layer (Axios) │ ├── components/ # Reusable UI components (StatCard, Modals, Navbar) │ ├── context/ # AuthContext with httpOnly session recovery │ ├── pages/ # Dashboard, Reports, Login, Register │ ├── App.jsx # Route guards (ProtectedRoute & PublicOnlyRoute) │ └── index.css # Responsive styling & themes

---
##  Getting Started
### Prerequisites
- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher
---
### 1. Database Setup
1. Start your local PostgreSQL server.
2. Create a database named `sweety_db`:
   ```sql
   CREATE DATABASE sweety_db;

   Backend Setup

Navigate to the backend directory:

cd backend
npm install

Create a .env file from .env.example:

env
PORT=5000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=sweety_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000

Initialize the database tables:

node src/schema/initdb.js

Seed demo patient and sample readings:

npm run seed

Demo Credentials:
Email: demo@example.com
Password: Password123

Start the backend development server:

npm run dev

Frontend Setup

Navigate to the frontend directory:

cd ../frontend
npm install

Create a .env file (or use .env.example):

env
VITE_API_BASE_URL=http://localhost:5000/api

Start the Vite development server:

npm run dev

Running Tests
-------------

The backend suite tests the glucose validation rules and report statistics calculations:

cd backend
npm test

Notes & Design Decisions
------------------------
Assumptions Made

Timezone Interpretation: Date inputs (YYYY-MM-DD) are computed against the client's local calendar day rather than UTC timestamps to prevent overnight date shifts.
Previous Month Semantics: Selecting any date in November (e.g., Nov 19) will generate the previous month report for the entire calendar month of October (Oct 1 – Oct 31).
Session Storage: Chose httpOnly secure cookies over localStorage to adhere to modern OWASP security recommendations against token theft via XSS.

What I Would Improve With More Time
-----------------------------------

Logbook Matrix View: Provide a toggle to view Month-to-Date readings in a grid matrix (Date | Fasting | Breakfast | Lunch | Dinner) with date-level pagination.

Containerization: Provide a docker-compose.yml to spin up PostgreSQL, the backend API, and Vite client with a single command.