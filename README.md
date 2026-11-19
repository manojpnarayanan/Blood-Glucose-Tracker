Sweety — Blood Glucose Tracker

A full-stack web application to help diabetes patients track daily blood glucose readings and view statistical reports.

Built with the PERN Stack (PostgreSQL, Express, React, Node.js) following the Repository Pattern.

Features
Secure registration & login with bcrypt password hashing and JWT via httpOnly cookies
Record up to 4 blood glucose readings per day (Fasting, Pre-Lunch, Post-Lunch, Bedtime)
View 3 report types with Min / Max / Avg statistics:
Daily Report
Month-to-Date (MTD) Report
Previous Month Report
Input validation with meaningful error messages
Fully responsive UI

Architecture — Repository Pattern

Controller → Service → Repository → PostgreSQL

backend/src/ ├── config/ # Database connection (pg Pool) ├── controllers/ # Route handlers (HTTP layer) ├── services/ # Business logic & validation ├── repositories/ # Database queries ├── middleware/ # Auth guard, error handler ├── routes/ # Express routers └── schema/ # SQL schema + DB init script

---
## Validation Rules
| Rule | Error Message |
|------|--------------|
| Empty glucose value | `Please enter a glucose value.` |
| Value out of range (< 40 or > 600) | `Value must be between 40 and 600 mg/dl.` |
| Future date | `Date cannot be in the future.` |
| Duplicate slot for date | `You already have a [slot] reading for this date.` |
| More than 4 readings per day | `You can add only 4 readings per day.` |
---

Start the backend server:

npm run dev

Start the frontend:

npm run dev

Running Tests

cd backend
npm test

7 tests covering glucose validation rules and report statistics.

Assumptions
A user can record a maximum of 4 readings per day (one per slot: Fasting, Pre-Lunch, Post-Lunch, Bedtime)
Glucose value must be between 40–600 mg/dL
Passwords must not contain leading or trailing whitespace
Auth is handled via httpOnly cookies (not localStorage) for XSS protection
Dates are interpreted in the user's local timezone (not UTC)
The "Previous Month" report covers the full calendar month before the current month