# 🔐 Express JWT Authentication API

Secure authentication and role-based authorization APIs built with **Express + MongoDB + JWT**.

---

## What this project provides

- User registration and login
- Password hashing with `bcryptjs`
- Access tokens for API authorization
- Refresh token rotation via secure `HttpOnly` cookie
- Logout and logout-all-devices support
- Role-based access control (`user`, `manager`, `admin`)
- Validation, central error handling, and basic auth rate limiting

---

## Project structure

```txt
.
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── testRoutes.js
│   └── userRoutes.js
└── server.js
```

---

## Authentication flow

1. `POST /api/auth/register` creates a user (always with role `user` for public signup).
2. `POST /api/auth/login` returns a short-lived **access token** and sets a secure refresh cookie.
3. Use access token in `Authorization: Bearer <token>` for protected APIs.
4. `POST /api/auth/refresh` rotates refresh token and issues a new access token.
5. `POST /api/auth/logout` clears refresh cookie.
6. `POST /api/auth/logout-all` increments `tokenVersion` to revoke all refresh tokens.

---

## Environment variables

Create `.env` in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

> `MONGO_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are required at startup.

---

## Run locally

```bash
npm install
npm run dev
```

Server: `http://localhost:3000`

---

## API endpoints

### Auth routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all` *(requires access token)*

### User routes

- `GET /api/users` *(admin only)*
- `GET /api/users/:id` *(own profile for user; manager/admin can view all)*
- `PUT /api/users/:id` *(own profile for user; admin can update all)*
- `DELETE /api/users/:id` *(admin only)*
- `DELETE /api/users` *(admin only)*

### RBAC test routes

- `GET /api/test/user` *(user, manager, admin)*
- `GET /api/test/manager` *(manager, admin)*
- `GET /api/test/admin` *(admin)*

---

## Sample requests

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "StrongPass123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "StrongPass123"
}
```

### Access protected route

```http
GET /api/test/user
Authorization: Bearer <access_token>
```

### Refresh token

```http
POST /api/auth/refresh
Cookie: refreshToken=<token>
```

---

## Notes for production

- Set `NODE_ENV=production` to enable `Secure` cookie flag.
- Configure `CLIENT_ORIGIN` explicitly (avoid wildcard in production).
- Add persistent/shared rate limiter (Redis-backed) for multi-instance deployments.
- Add automated integration tests for auth and RBAC flows.
