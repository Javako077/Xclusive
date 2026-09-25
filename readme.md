# 🏋️ Xclusive Gym Web App

Welcome to **Xclusive Gym**!

The frontend and backend of this project have been completely separated into independent applications. Both applications communicate cleanly through REST APIs without being directly dependent on each other.

---

## ✨ Features Overview

### 1. 🌐 Frontend (React + Vite + Tailwind CSS)

* **Premium UI/UX:** A sleek dark-themed design with modern animations using Framer Motion, vibrant HSL colors, and the Outfit font.
* **Interactive Calculators:**

  * **1-Rep Max (1RM) Calculator:** Calculates your maximum strength for different lifts.
  * **Macro Calculator:** Calculates personalized protein, carbohydrate, and fat targets based on fitness goals.
  * **BMI Calculator:** Helps users track basic body mass and weight-related metrics.
* **Before-After Slider:** Allows users to interactively explore fitness transformation results using a vertical slider.
* **Facility Tour & Videos:** Includes a virtual tour modal and exercise biomechanics animations.
* **Contact & Free Pass Forms:** Provides simple forms for users to contact the gym and generate a free gym pass.

### 2. ⚡ Backend (Node.js + Express.js + MongoDB)

* **Secure Authentication:** Uses **Bcrypt.js** for secure password hashing and **JWT (JSON Web Tokens)** for authentication and session management.
* **Modular Code Structure:** Follows the MVC architecture with Models, Controllers, Routes, and Middleware.
* **Database Management:** Uses MongoDB with Mongoose schemas for managing Users, Saved Workout Plans, and Contact Enquiries.
* **CORS Support:** Configured to allow API requests from different frontend locations and ports.

---

## 📂 Project Directory Structure

```text
xclusiveWeb/
├── backend/                  <-- Express & Node.js API Server
│   ├── config/               <-- MongoDB Database Connection
│   ├── controllers/          <-- Main controller logic files (Auth, User, Contact, AI)
│   ├── middleware/           <-- Authentication protection middleware (JWT)
│   ├── models/               <-- Mongoose Schemas (User.js, Contact.js)
│   ├── routes/               <-- API Endpoint Routes
│   ├── .env                  <-- Port, MongoDB URI, JWT Secret
│   ├── package.json          <-- Backend-only dependencies
│   └── server.js             <-- Node.js application entry point
│
└── frontend/                 <-- React Client Application
    ├── src/
    │   ├── components/       <-- Modular UI sections and modals
    │   ├── services/api.js   <-- Backend REST API service
    │   └── App.jsx           <-- Application entry configuration
    ├── .env                  <-- VITE_API_BASE_URL (Backend URL)
    └── package.json          <-- Frontend dependencies
```

---

## 🚀 How to Set Up and Run the Project

Since the frontend and backend are separate applications, they need to be run from their respective folders.

### Step 1: Backend Configuration

1. Open a new terminal and navigate to the backend folder:

```bash
cd xclusiveWeb/backend
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file, or copy `.env.example` and rename it to `.env`. Then add the required credentials:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/xclusive
JWT_SECRET=your_secret_key_here

```

4. Start the backend in development mode:

```bash
npm run dev
```

**Note:** The backend server will run at:

`http://localhost:3000`

---

### Step 2: Frontend Configuration

1. Open another terminal and navigate to the frontend folder:

```bash
cd xclusiveWeb/frontend
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file, or copy `.env.example` and rename it to `.env`. Specify the backend URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

4. Start the frontend development server:

```bash
npm run dev
```

**Note:** The frontend will be available at:

`http://localhost:5173`
