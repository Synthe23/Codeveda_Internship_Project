# TaskFlow — Codveda Full-Stack Development Project

A complete JavaScript full-stack task management application built to cover the Codveda Full-Stack Development task requirements.

## Included levels/tasks

### Level 1
- Task 1: Development environment documentation
- Task 2: REST API with Express + CRUD
- Task 3: Frontend with HTML/CSS/JavaScript concepts (implemented through React's browser UI and Fetch/Axios-style API integration)

### Level 2
- Task 1: React frontend with functional components, state management, reusable components and loading/error states
- Task 2: Authentication and Authorization with bcrypt + JWT + role-based protected routes
- Task 3: MongoDB + Mongoose models, validation and indexes

### Level 3
- Task 1: Full-stack MERN application with authentication, database interaction and frontend integration
- Task 2: Socket.io real-time task notifications
- Task 3: GraphQL API with Apollo Server, queries, mutations and authenticated context

## Stack

- Frontend: React + Vite + React Router + Axios + CSS
- Backend: Node.js + Express (ES Modules)
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs + HTTP-only cookie
- Real-time: Socket.io
- GraphQL: Apollo Server
- Validation: express-validator
- Security: Helmet, CORS, rate limiting
- Package manager: npm

## Project structure

```text
codveda-taskflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── graphql/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 1. Start MongoDB

### Option A — Docker

```bash
docker compose up -d
```

### Option B — local MongoDB

Install and run MongoDB locally, then use:

```text
mongodb://127.0.0.1:27017/codveda_taskflow
```

## 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend:
- REST: http://localhost:5000/api
- Health: http://localhost:5000/api/health
- GraphQL: http://localhost:5000/graphql

## 3. Frontend

In another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## Demo account

You can register from the UI. The first registered user is a normal `user`.

For an admin account during development, set:

```text
ALLOW_ADMIN_REGISTRATION=true
```

in backend `.env`, then register with the `admin` role. Set it back to `false` afterward.

## REST endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Tasks

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

### Users

```text
GET /api/users
GET /api/users/:id
```

User listing is restricted to admins.

## GraphQL

GraphQL endpoint:

```text
POST /graphql
```

Main operations:

```graphql
query {
  tasks {
    id
    title
    status
    priority
  }
}
```

```graphql
mutation {
  createTask(title: "Prepare Codveda demo", priority: HIGH) {
    id
    title
  }
}
```

The frontend uses REST for normal task management and Socket.io for real-time updates. GraphQL is included as the Level 3 alternative API.

## Authentication design

1. User registers with a password.
2. Password is hashed using bcrypt.
3. Login verifies the password.
4. Backend signs a JWT.
5. JWT is stored in an HTTP-only cookie.
6. Protected middleware verifies the JWT.
7. Role middleware restricts admin-only endpoints.

## Real-time design

When a task is created, updated or deleted:
- the server changes MongoDB
- Socket.io emits a `task:changed` event
- connected clients refresh their task list

This demonstrates bidirectional real-time communication without exposing the JWT to browser JavaScript.

## Security notes

- Passwords are never stored in plaintext.
- JWT secret comes from environment variables.
- HTTP-only cookie is used for authentication.
- Helmet adds common HTTP security headers.
- CORS is restricted to the configured frontend origin.
- Express rate limiting protects authentication endpoints.
- Request body size is limited.
- Input validation is performed before mutations.
- Mongoose indexes are defined for common task queries.

## Development commands

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Codveda submission checklist

The provided Codveda brief asks interns to complete two tasks per level, submit through the submission form, and share a project video/GitHub repository on LinkedIn. This repository is intentionally broader and implements all three levels so you can demonstrate the complete progression.

Reference: the provided Codveda brief, pages 6–14. It specifies REST CRUD, frontend/API integration, React, JWT authentication, database integration, full-stack deployment, Socket.io and GraphQL objectives.
