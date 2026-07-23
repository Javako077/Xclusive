# 🏋️‍♂️ APEX Athletic Lab - Xclusive Gym Web App

Welcome to **APEX Athletic Lab (Xclusive Gym)**! Ye ek full-stack MERN web application hai jisme premium fitness features, interactive fitness calculators, user authentication aur ek dynamic **APEX AI Coach** (powered by Gemini AI) shaamil hai.

Humne is project ke Frontend aur Backend ko completely separate (independent) kar diya hai, jisse ye dono folder bina kisi dependency ke aapas me clean REST APIs ke jariye coordinate karte hain.

---

## ✨ Features Overview

### 1. 🌐 Frontend (React + Vite + Tailwind CSS)
* **Premium UI/UX:** Dark-themed sleek design with modern animations (using Framer Motion), vibrant HSL colors, and Outfit font.
* **Interactive Calculators:**
  - **1-Rep Max (1RM) Calculator:** Apne maximum strength lifts calculate karne ke liye.
  - **Macro Calculator:** Apne fitness goals ke hisab se nutrition targets (protein, carbs, fats) split janne ke liye.
  - **BMI Calculator:** Health and weight metrics trace karne ke liye.
* **APEX AI Coach:** Powered by **Gemini 3.6 Flash**. Isse aap personal training plans, nutrition advices aur workouts schedule ke recommendations le sakte hain aur use profile me save kar sakte hain.
* **Before-After Slider:** User transformations ko interactively explore karne ke liye vertical slider.
* **Facility Tour & Videos:** Virtual tour modal aur exercise biomechanics animations.
* **Contact & Free Pass Forms:** New users ke liye gym free pass generate karne ka simple form flow.

### 2. ⚡ Backend (Node.js + Express.js + MongoDB)
* **Secure Auth:** Proper password hashing with **Bcrypt.js** aur sessions authentication securely control karne ke liye **JWT (JSON Web Tokens)** logic.
* **Modular Code Structure:** MVC pattern (Models, Controllers, Routes, Middlewares).
* **Gemini AI Integration:** API ke zariye custom system prompt injection ke sath AI Coach system response handling.
* **Database Management:** MongoDB Database with Mongoose schemas (Users, Saved Workout Plans, Contact Enquiries).
* **Universal CORS Enabled:** Kisi bhi dynamic location/port se API calling compatibility ensure karne ke liye.

---

## 📂 Project Directory Structure

```text
xclusiveWeb/
├── backend/                  <-- Express & Node.js API Server
│   ├── config/               <-- MongoDB Database Connection
│   ├── controllers/          <-- Main controller logic files (Auth, User, Contact, AI)
│   ├── middleware/           <-- Authentication protection middlewares (JWT)
│   ├── models/               <-- Mongoose Schemas (User.js, Contact.js)
│   ├── routes/               <-- API Endpoint path routes
│   ├── .env                  <-- Port, MongoDB Uri, JWT Secret, Gemini key
│   ├── package.json          <-- Backend-only dependencies list
│   └── server.js             <-- Node application server root
│
└── frontend/                 <-- React Client App
    ├── src/
    │   ├── components/       <-- Modular UI sections & modals
    │   ├── services/api.js   <-- Backend REST API calling service
    │   └── App.jsx           <-- App entry view configuration
    ├── .env                  <-- VITE_API_BASE_URL (Points to backend)
    └── package.json          <-- React-only dependencies list
```

---

## 🚀 How to Setup & Run the Project

Dono project separate hain, isliye inko chalane ke liye aapko inke respective folders me jana hoga.

### Step 1: Backend Configuration
1. Naye terminal me backend folder me jayein:
   ```bash
   cd xclusiveWeb/backend
   ```
2. Dependencies install karein:
   ```bash
   npm install
   ```
3. Ek `.env` file banayein (ya `.env.example` ko copy karke `.env` rename karein) aur credentials add karein:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/xclusive
   JWT_SECRET=your_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Backend ko Dev mode me chalayein:
   ```bash
   npm run dev
   ```
   *Note: Backend server **http://localhost:3000** par run hoga.*

---

### Step 2: Frontend Configuration
1. Ek alag (naye) terminal me frontend folder me jayein:
   ```bash
   cd xclusiveWeb/frontend
   ```
2. Dependencies install karein:
   ```bash
   npm install
   ```
3. Ek `.env` file banayein (ya `.env.example` ko copy karke `.env` rename karein) aur backend URL specify karein:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Frontend ko chalayein:
   ```bash
   npm run dev
   ```
   *Note: Frontend server **http://localhost:5173** par open hoga.*

---

## 🔒 Security Best Practices
- Kabhi bhi backend ki `.env` file ko git/github pe commit na karein.
- User data fetch ya plans change karne se pehle frontend automatically local token check karega aur standard `Bearer <token>` request header handle karega.
- Mongoose schemas validations ensure karte hain ki invalid ya empty inputs submit na ho payein.
