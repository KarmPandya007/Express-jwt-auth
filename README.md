# 🔐 Express JWT Authentication API

A clean and simple JWT auth API using Express and MongoDB.

## What this version focuses on

- Simple login/register flow
- Secure password hashing (`bcryptjs`)
- JWT access token auth for protected APIs
- Role-based authorization (`user`, `manager`, `admin`)
- Input validation on auth routes
- Consistent API errors and 404 handling

## Quick start

### 1) Install

```bash
npm install
```

### 2) Create `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
```

### 3) Run

```bash
npm run dev
```

Server: `http://localhost:3000`

## Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

### Register request

```json
{
  "username": "john_doe",
  "password": "StrongPass123"
}
```

### Login response (example)

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "expiresIn": "1h",
  "user": {
    "id": "...",
    "username": "john_doe",
    "role": "user"
  }
}
```

## Using protected routes

Pass the token in the Authorization header:

```http
Authorization: Bearer <jwt>
```

## Existing protected route groups

- `/api/users/*` (role-based access)
- `/api/test/*` (quick role testing)

## Notes

- Public registration always creates `role: user` (prevents self-assigning admin).
- If needed later, refresh-token flow can be added in a separate phase.
