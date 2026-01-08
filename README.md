🔐 Express JWT Authentication API
Secure Authentication • Token-Based Access • Scalable Backend Design
📌 Overview

This repository implements a secure authentication and authorization system using Express.js and JSON Web Tokens (JWT).

The project is designed to demonstrate how modern backend applications handle user authentication, protect routes, and manage secure access using token-based authentication. It follows clean architecture principles and real-world backend best practices.

This is not just a login/signup demo — it focuses on security, structure, and scalability.

🎯 Key Concepts Covered

User registration & login flow

Password hashing using bcrypt

JWT generation & verification

Protected routes using middleware

Token-based authentication strategy

Clean separation of routes, controllers, and middleware

Environment-based configuration

🛠 Tech Stack

Node.js

Express.js

JWT (jsonwebtoken)

MongoDB

Mongoose

bcrypt

dotenv

📂 Project Structure
Express-jwt-auth
│
├── config
│   └── db.js               # Database connection
│
├── controllers
│   └── authController.js   # Auth business logic
│
├── middleware
│   └── authMiddleware.js  # JWT verification
│
├── models
│   └── User.js             # User schema
│
├── routes
│   └── authRoutes.js       # Auth endpoints
│
├── .env                    # Environment variables
├── index.js                # Entry point
├── package.json
└── README.md

✨ Features

User signup & login

Secure password hashing

JWT-based authentication

Protected API routes

Middleware-driven auth checks

Clean and scalable codebase

Easy to extend with roles & permissions

▶️ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/KarmPandya007/Express-jwt-auth.git
cd Express-jwt-auth

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env file in the root directory:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Start the Server
npm run dev


Server will start at:

http://localhost:3000