# Swivvy 

A production-grade social networking platform built for students to discover, connect, and interact with people who share similar interests, skills, and educational backgrounds.

Swivvy combines swipe-based matching, real-time messaging, secure authentication, and modern full-stack architecture to create a networking experience inspired by Tinder while focusing on friendship-building and student communities.

---

## Overview

Swivvy is a full-stack MERN application designed to help students build meaningful connections through a modern swipe-based matching experience.

Users can create profiles, showcase their skills and interests, discover other students, match with like-minded people, and communicate through real-time one-to-one messaging.

Swivvy 2.0 represents a major architectural upgrade from the original JavaScript version, with a complete migration of both frontend and backend codebases to TypeScript.

---

## Swivvy Migration

One of the major goals of this version was improving maintainability, scalability, and type safety.

### Improvements

* Migrated frontend from JavaScript to TypeScript
* Migrated backend from JavaScript to TypeScript
* Refactored API contracts with static typing
* Improved developer experience and code maintainability
* Reduced runtime errors through compile-time type checking
* Reorganized backend using MVC architecture
* Improved folder structure and code separation

---

## Features

### Authentication

* JWT Authentication
* Access Token + Refresh Token Flow
* Refresh Token Rotation
* HTTP-only Secure Cookies
* Protected Routes
* Persistent Authentication Sessions

### Matching System

* Tinder-inspired swipe experience
* Right-swipe matching logic
* Mutual match detection
* Automatic chat unlocking after successful match

### Real-Time Chat

* Socket.IO powered messaging
* One-to-one real-time communication
* Instant message delivery
* Match-based chat access

### Profile Management

* Profile Picture Upload
* Bio Management
* Skills Showcase
* Interest-Based Profiles

### Cloud Storage

* Cloudinary Integration
* Cloud-based profile image storage
* Optimized media delivery

### Security

* Password Hashing with bcrypt
* Rate Limiting
* Protected APIs
* Input Validation
* CORS Configuration
* HTTP-only Cookie Authentication

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* React Swipeable
* Fetch API

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB Atlas
* Socket.IO
* JWT
* bcrypt

### Cloud & Deployment

* Cloudinary
* Render

---

## Architecture

### Frontend Structure

```bash
src/
├── component/
├── views/
├── App.tsx
├── main.tsx
├── socket.ts
└── index.css
```

### Backend Structure

```bash
src/
├── config/
├── controller/
├── middlewares/
├── models/
├── routes/
├── sockets/
├── utils/
├── connection.ts
└── Server.ts
```

### Backend Design Pattern

* MVC Architecture
* Centralized Middleware Layer
* Modular Route Handling
* Reusable Utility Functions
* Scalable Socket Architecture

---

## Database

### MongoDB Atlas Collections

#### Users

Stores:

* User information
* Bio
* Skills
* Interests
* Profile Images
* Authentication Data

#### Messages

Stores:

* Sender Information
* Receiver Information
* Chat Messages
* Message Timestamps

---

## Matching Flow

1. User discovers profiles.
2. User performs a swipe action.
3. Swipe event triggers backend API.
4. Match is created when both users swipe right.
5. Chat access is automatically unlocked.
6. Users can communicate through Socket.IO powered messaging.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/kartik3030/Swivvy.git
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

---

## Environment Variables

### Backend

```env
PORT=
MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=
```

---

## Deployment

Frontend and Backend are deployed on Render.

Live Demo:

https://relay-1-g5dy.onrender.com

Repository:

https://github.com/kartik3030/Swivvy

---

## Security Highlights

* Refresh Token Authentication
* HTTP-only Cookies
* Password Hashing
* Rate Limiting
* Protected Routes
* Input Validation
* CORS Protection

---

## Future Roadmap

* Google OAuth Authentication
* Password Reset Functionality
* Skeleton Loading Screens
* Docker Support
* CI/CD Pipeline
* AI Bio Suggestions
* AI Opening Message Suggestions
* Advanced User Discovery Filters
* Real-Time Presence Indicators
* Typing Indicators

---

## Author

Kartik

Computer Science Student | Full-Stack Developer

Focused on scalable web applications, TypeScript architecture, real-time systems, and modern full-stack development.
