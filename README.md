# Swivvy 

A production-grade social networking platform built for students to discover, connect, and interact with people who share similar interests, skills, and educational backgrounds.

Swivvy combines swipe-based matching, real-time messaging, secure authentication, AI-powered profile enhancements, and modern full-stack architecture to create a networking experience inspired by Tinder while focusing on friendship-building and student communities.

---

## Highlights

* Full migration from JavaScript to TypeScript
* MVC-based backend architecture
* Dockerized frontend and backend services
* JWT + Refresh Token authentication
* Google OAuth 2.0 integration
* Real-time messaging with Socket.IO
* Cloudinary media management
* AI-powered bio generation
* Production deployment on Render

---

## Overview

Swivvy is a full-stack MERN application designed to help students build meaningful connections through a modern swipe-based matching experience.

Users can create profiles, showcase their skills and interests, discover other students, match with like-minded people, and communicate through real-time one-to-one messaging.

Swivvy 2.0 represents a major architectural upgrade from the original version, featuring a complete migration of both frontend and backend codebases to TypeScript, improved project structure, enhanced authentication systems, AI-powered profile assistance, and Dockerized deployment.

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
* Google OAuth 2.0 Authentication
* HTTP-only Secure Cookies
* Protected Routes
* Persistent Authentication Sessions
* Password Reset Functionality

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

### AI Features

* AI Bio Suggestions

### Profile Management

* Profile Picture Upload
* Bio Management
* Skills Showcase
* Interest-Based Profiles

### Cloud Storage

* Cloudinary Integration
* Optimized Image Uploads
* Cloud-Based Media Management

### Security

* Password Hashing with bcrypt
* Refresh Token Rotation
* Rate Limiting
* Input Validation
* Protected APIs
* CORS Configuration
* HTTP-only Cookie Authentication
* Password Reset Security

### DevOps & Deployment

* Dockerized Frontend & Backend
* Docker Hub Image Distribution
* Containerized Development Environment
* Render Deployment

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

### AI

* OpenAI API

### Cloud & Deployment

* Cloudinary
* Docker
* Docker Hub
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

* User Information
* Authentication Data
* Bio
* Skills
* Interests
* Profile Images

#### Messages

Stores:

* Sender Information
* Receiver Information
* Chat Messages
* Message Timestamps

#### Matches

Stores:

* User Match Information
* Match Relationships
* Match Creation Timestamps

---

## Matching Flow

1. User discovers profiles.
2. User performs a swipe action.
3. Swipe event triggers backend API.
4. Match is created when both users swipe right.
5. Chat access is automatically unlocked.
6. Users communicate through Socket.IO powered messaging.

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
PORT=3000

MONGO_URI=<your_mongodb_connection_string>

JWT_SECRET=<your_jwt_secret>

CLIENT_URL=http://localhost:5173

NODE_ENV=development

CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

GEMINI_API_KEY=<your_gemini_api_key>

EMAIL_USER=<your_email_address>
EMAIL_APP_PASSWORD=<your_email_app_password>

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

BACKEND_URL=<your_backend_URL>
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
```


---

## Docker

Swivvy is fully containerized using Docker for consistent local development and deployment.

### Pull Images

#### Frontend

```bash
docker pull kartik3030/swivvy-frontend:v1
```

#### Backend

```bash
docker pull kartik3030/swivvy-backend:v1
```

### Run Backend

```bash
docker run --env-file .env -p 5000:5000 kartik3030/swivvy-backend:v1
```

### Run Frontend

```bash
docker run -p 3000:3000 kartik3030/swivvy-frontend:v1
```

### Build Locally

#### Backend

```bash
docker build -t swivvy-backend .
```

#### Frontend

```bash
docker build -t swivvy-frontend .
```

### Benefits

* Consistent development and production environments
* Simplified deployment process
* Portable application packaging
* Faster onboarding for contributors
* Improved infrastructure management

---

## Deployment

Frontend and Backend are deployed on Render.

### Live Demo

https://swivvy.onrender.com

### Docker Hub

#### Backend

```bash
docker pull kartik3030/swivvy-backend:v1
```

#### Frontend

```bash
docker pull kartik3030/swivvy-frontend:v1
```

### Repository

https://github.com/kartik3030/Swivvy

---

## Security Highlights

* JWT Authentication
* Refresh Token Rotation
* Secure HTTP-only Cookies
* Password Hashing with bcrypt
* Password Reset Protection
* OAuth 2.0 Authentication
* Input Validation
* CORS Protection
* Rate Limiting

---

## Future Roadmap

### Security

* End-to-End Encryption for Chat

### Frontend

* Skeleton Loading Screens
* Shuffled Profiles UI

### AI Features

* AI Opening Message Suggestions

### DevOps

* CI/CD Pipeline
* AWS Deployment
* Nginx Reverse Proxy
* PM2 Process Management
* Custom Domain & SSL

### Scalability

* Redis Caching
* Load Balancer

### Real-Time Features

* Real-Time Presence Indicators
* Typing Indicators

### Discovery

* Advanced User Discovery Filters

---

## Author

### Kartik

Computer Science Student | Full-Stack Developer

Focused on scalable web applications, TypeScript architecture, real-time systems, DevOps, AI integrations, and modern full-stack development.
