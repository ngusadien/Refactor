

##  Overview

This is a  refactoring of the Sokoni Africa marketplace from vanilla JavaScript to a modern React application with a full-featured backend.


##  What's Been Done

### Frontend (React + Redux + Tailwind) 

#### Core Setup
-  React 19 with Vite
-  Tailwind CSS v4 with custom theme
-  Redux Toolkit for state management
-  React Router v6 with protected routes
-  i18next for multi-language (English & Swahili)
-  Axios for API communication
-  Responsive design (mobile-first)

#### Pages & Components
- Authentication (Login, Register, OTP verification)
-  Products (listing, detail, search, filters)
-  Shopping Cart (add, remove, update, persist)
-  Orders (list, detail, tracking, cancel)
-  Messages/Chat interface
-  User Profile management
-  Settings (language, theme, notifications)
-  Warehouse Management
-  Delivery Tracking
-  Navigation (Navbar, Sidebar, Footer)
-  404 Error Page

#### Redux Slices
-  Auth (login, register, logout, token refresh)
-  Products (fetch, search, filter)
-  Cart (localStorage persistence)
-  Orders (CRUD operations)
-  Messages (conversations, send)
-  Notifications (unread count)
-  User (profile, settings)

#### Features
-  JWT token management with auto-refresh
-  Protected routes
-  Multi-language switching
-  Responsive design for all devices
-  Loading states
-  Error handling
-  Custom Tailwind components

### Backend (Node.js + Express + MongoDB) 

#### Database Models 
-  User (auth, profile, KYC, settings)
-  Product (enhanced with categories, warehouse, ratings)
-  Category (hierarchical support)
-  Order (items, payment, shipping)
-  Conversation (participants, unread)
-  Message (attachments, read receipts)
-  Delivery (tracking, driver assignment)
-  Warehouse (inventory management)
-  Notification (types, read status)

#### Middleware & Utils (100% Complete)
-  JWT generation & verification
-  Authentication middleware
-  Authorization middleware (role-based)
-  Error handler middleware

#### Controllers (30% Complete)
-  Auth controller (register, login, OTP, refresh, logout)
-  Users controller
-  Products controller (update existing)
-  Orders controller
-  Messages controller
-  Deliveries controller
-  Warehouses controller
-  Notifications controller

#### Routes 
-  Auth routes
-  Products routes (exists, needs update)
-  All other routes

#### Configuration
-  MongoDB connection
-  Environment variables (.env)
-  CORS setup
-  File upload directory
-  Error handling


## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm 

### Installation

**1. Start MongoDB**
  run on bash
mongod

**2. Backend Setup**
##navigate to project directory
## example cd e:\DA\sokoni-api
npm install
npm start
```
→ Runs on http://localhost:3000



**3. Frontend Setup**
## navigate to project directory 
## example cd e:\DA\sokoni-frontend
npm install
npm run dev
```
→ Runs on http://localhost:5173

### First Steps

1. Open http://localhost:5173
2. Register a new account
3. Check backend console for OTP code
4. Explore the application!






4. **PWA Features** 

    Service worker
    Manifest.json
    Offline support
    Push notifications
   
