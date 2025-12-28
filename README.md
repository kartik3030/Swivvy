Swivvy
A Production-Ready Social Matching Application

Swivvy is a full-stack social matching platform that allows users to discover profiles, form matches, and communicate through real-time chat.

It is built with production-grade authentication, real-time communication, and a clean, scalable architecture following modern industry standards.

This project demonstrates end-to-end ownership, including frontend development, backend APIs, database design, authentication, and deployment readiness.

This is not a tutorial or demo project. It reflects how real-world products are designed and built.

Core Features
Authentication & Security

Secure user signup and login

HTTP-only, cookie-based JWT authentication

Protected routes on both frontend and backend

Logout and account deletion

Token validation on every request

Profile Management

Profile creation and editing

Bio, skills, country, and profile photo support

Server-side file uploads using Multer

Secure profile updates with authentication checks

Swipe & Match System

Tinder-style swipe interaction

No duplicate users in feed

Mutual likes result in matches

Optimized MongoDB queries for performance

Real-Time Messaging

One-to-one real-time chat using Socket.IO

Room-based messaging architecture

Message persistence with MongoDB

Optimistic UI updates for smooth user experience

Screenshots

Screenshots will be added after deployment.

Authentication flow

Swipe and match interface

Real-time chat

Profile management

Tech Stack
Frontend

React (Vite)

React Router

Tailwind CSS

Socket.IO Client

Backend

Node.js

Express.js

MongoDB with Mongoose

Socket.IO

JWT (HTTP-only cookies)

Multer for file uploads

Architecture Overview
Client (React)
   ↓ (HTTP-only cookies)
Express API
   ↓
MongoDB
   ↓
Socket.IO Server


Key architectural decisions:

Frontend never accesses JWT directly

Browser handles authentication cookies securely

Backend validates authentication on every request

Single server serves both API endpoints and frontend build

Project Structure
Swivvy/
├── Backend/
│   ├── src/
│   │   ├── Database/
│   │   ├── Models/
│   │   └── Server.js
│   └── uploads/        # gitignored
│
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── api.js
│   │   └── socket.js
│   └── dist/           # generated on build
│
├── .gitignore
└── README.md

Authentication Flow (Production-Grade)

User logs in

Backend issues a JWT

JWT is stored in an HTTP-only cookie

Browser automatically sends cookie with requests

Backend verifies token on each request

Frontend remains token-agnostic

Security benefits:

Prevents XSS attacks

Safer than localStorage-based auth

Suitable for real production environments

Environment Variables
Backend (Backend/.env)
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development

Frontend (Frontend/.env)
VITE_API_URL=http://localhost:3000

Running Locally
Backend
cd Backend
npm install
npm start

Frontend
cd Frontend
npm install
npm run dev

Production Build
cd Frontend
npm run build


The backend automatically serves the Frontend/dist build in production.

Future Enhancements

Cloud-based image storage (S3 or Cloudinary)

Push notifications

Online/offline presence indicators

Group chat support

Rate limiting and enhanced security headers

Author

Kartik
Full-Stack Developer (MERN)

Focused on building secure, scalable, production-ready web applications.

Recruiter Note

This project demonstrates:

Full-stack ownership

Secure authentication using cookies

Real-time communication with Socket.IO

Clean, deployable system architecture

If this repository were a startup MVP, it would be ready to ship.
