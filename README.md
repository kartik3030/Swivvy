Swivvy 
A Production-Ready Social Media Application

Swivvy is a full-stack social matching platform that enables users to discover profiles, create matches, and chat in real time.
It is built with production-grade authentication, real-time communication, and clean architecture, following modern industry standards.

This project demonstrates end-to-end ownership — frontend, backend, database design, authentication, and deployment readiness.

This is not a tutorial project — it reflects how real products are built.

✨ Core Features
🔐 Authentication & Security

Secure login & signup

HTTP-only cookie-based JWT

Protected routes (frontend + backend)

Logout & account deletion

👤 Profile Management

Profile creation & editing

Bio, skills, country & profile photo upload

Server-side file handling (Multer)

🔥 Swipe & Match System

Tinder-style swipe experience

No duplicate users in feed

Mutual likes create matches

Optimized MongoDB queries

💬 Real-Time Messaging

One-to-one real-time chat using Socket.IO

Room-based architecture

Chat persistence with MongoDB

Optimistic UI updates

🖼 Screenshots (Add Yours Here)

Replace these with actual screenshots once deployed

🔑 Authentication

🧭 Swipe & Match

💬 Real-Time Chat

👤 Profile

🛠 Tech Stack
Frontend

React (Vite)

React Router

Tailwind CSS

Socket.IO Client

Backend

Node.js

Express.js

MongoDB & Mongoose

Socket.IO

JWT (cookie-based auth)

Multer (file uploads)

🧱 Architecture Overview
Client (React)
   ↓ (cookies)
Express API
   ↓
MongoDB
   ↓
Socket.IO Server


Frontend never reads JWT directly

Browser handles auth cookies securely

Backend validates token on every request

Single server serves both API + frontend build

📁 Project Structure
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

🔐 Authentication Flow (Production-Grade)

User logs in

Backend issues JWT

JWT stored in HTTP-only cookie

Browser automatically sends cookie

Backend verifies token per request

Frontend stays token-agnostic

✅ Prevents XSS
✅ Safer than localStorage
✅ Scales to real production apps

⚙️ Environment Variables
Backend (Backend/.env)
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development

Frontend (Frontend/.env)
VITE_API_URL=http://localhost:3000

▶️ Run Locally
# Backend
cd Backend
npm install
npm start

# Frontend
cd Frontend
npm install
npm run dev

🚀 Production Build
cd Frontend
npm run build


Backend automatically serves Frontend/dist.

📌 Future Enhancements

Cloud image storage (S3 / Cloudinary)

Push notifications

Online/offline indicators

Group chats

Rate limiting & helmet security

👨‍💻 Author

Kartik
Full-Stack Developer (MERN)

Focused on building secure, scalable, production-ready web applications.

⭐ Recruiter Note

This project demonstrates:

Full-stack ownership

Real authentication & sockets

Clean, deployable architecture

If this repository were a startup MVP — it would ship.
