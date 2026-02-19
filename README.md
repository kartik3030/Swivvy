# Swivvy

A Production-Ready Social Matching Application

Swivvy is a full-stack social matching platform that allows users to discover profiles, form matches, and communicate through real-time chat.

It is built with production-grade authentication, real-time communication, and a clean, scalable architecture following modern industry standards.

This project demonstrates end-to-end ownership, including frontend development, backend APIs, database design, authentication, and deployment readiness.

This is not a tutorial or demo project. It reflects how real-world products are designed and built.

---

## Core Features

### Authentication & Security

* Secure user signup and login
* HTTP-only, cookie-based JWT authentication
* Protected routes on both frontend and backend
* Logout and account deletion
* Token validation on every request

### Profile Management

* Profile creation and editing
* Bio, skills, country, and profile photo support
* Server-side file uploads using Multer
* Secure profile updates with authentication checks

### Swipe & Match System

* Tinder-style swipe interaction
* No duplicate users in feed
* Mutual likes result in matches
* Optimized MongoDB queries for performance

### Real-Time Messaging

* One-to-one real-time chat using Socket.IO
* Room-based messaging architecture
* Message persistence with MongoDB
* Optimistic UI updates for smooth user experience

---

## Tech Stack

### Frontend

* React (Vite)
* React Router
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* Socket.IO
* JWT (HTTP-only cookies)
* Multer for file uploads

---

## Key Architectural Decisions

* Frontend never accesses JWT directly
* Browser handles authentication cookies securely
* Backend validates authentication on every request
* Single server serves both API endpoints and frontend build

---

## Authentication Flow (Production-Grade)

1. User logs in
2. Backend issues a JWT
3. JWT is stored in an HTTP-only cookie
4. Browser automatically sends cookie with requests
5. Backend verifies token on each request
6. Frontend remains token-agnostic

---

## Security Benefits

* Prevents XSS attacks
* Safer than localStorage-based authentication
* Suitable for real production environments

---

## Environment Variables

Do not commit real credentials to version control. Use a local `.env` file.

### Backend (Backend/.env)

```
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (Frontend/.env)

```
VITE_API_URL=http://localhost:3000
```

Add `.env` to `.gitignore` to prevent credential leaks.

---

## Project Structure

```
Swivvy/
│
├── Backend/
│   ├── src/
│   │   ├── Database/
│   │   │   └── db.js
│   │   ├── Models/
│   │   │   ├── User.js
│   │   │   └── Message.js
│   │   ├── uploads/
│   │   └── Server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── dist/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Aside.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── IsAuthN.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar2.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SwipeCard.jsx
│   │   ├── Pages/
│   │   │   ├── EditProfile.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── Signup.jsx
│   │   ├── api.js
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Running Locally

### Backend

```
cd Backend
npm install
npm start
```

### Frontend

```
cd Frontend
npm install
npm run dev
```

---

## Production Build

```
cd Frontend
npm run build
```

The backend automatically serves the Frontend/dist build in production.

---

## Future Enhancements

* Cloud-based image storage (S3 or Cloudinary)
* Push notifications
* Online/offline presence indicators
* Group chat support
* Rate limiting and enhanced security headers

---

## LinkedIn Post

[https://www.linkedin.com/feed/update/urn:li:activity:7414640675083874304/](https://www.linkedin.com/feed/update/urn:li:activity:7414640675083874304/)

---

## Author

Kartik
Full-Stack Developer (MERN)

Focused on building secure, scalable, production-ready web applications.

---

## Recruiter Note

This project demonstrates:

* Full-stack ownership
* Secure authentication using cookies
* Real-time communication with Socket.IO
* Clean, deployable system architecture
