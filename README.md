# Team Task Manager

Production-style full-stack Task and Project Management web application with project-level RBAC, Kanban task board, dashboard analytics, and JWT authentication.

## Tech Stack

- Frontend: React (hooks), React Router v6, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MySQL (`mysql2`)
- Auth/Security: JWT, bcryptjs, helmet, cors, express-rate-limit
- Validation: express-validator (backend), custom form validation (frontend)
- Utilities: dotenv, morgan

## Project Structure

- `src` - frontend app (acts as `/client/src` equivalent)
- `server` - backend API
- `db` - schema and seed scripts

## Setup

### 1) Install dependencies

```bash
npm install
cd server && npm install
```

### 2) Environment setup

- Copy `./.env.example` to `./.env`
- Copy `./server/.env.example` to `./server/.env`

### 3) Initialize database

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

Seed login credentials (password for both): `Password123`

- Admin: `admin@example.com`
- Member: `member@example.com`

### 4) Run servers

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
npm run dev
```

## Environment Variables

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | API base URL, e.g. `http://localhost:5000/api` |

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | JWT signing key |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1d`) |
| `CLIENT_URL` | Frontend URL for CORS |
| `PORT` | Backend server port |

## API Documentation

All endpoints are prefixed with `/api` and return JSON in the format:

```json
{ "success": true, "data": {}, "message": "..." }
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login and return JWT |
| POST | `/auth/logout` | Public | Logout response |
| GET | `/auth/me` | Auth | Current user profile |
| GET | `/projects` | Auth | List user projects |
| POST | `/projects` | Auth | Create project (creator becomes admin) |
| GET | `/projects/:id` | Member/Admin | Project details + members |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project |
| POST | `/projects/:id/members` | Admin | Invite member by email |
| DELETE | `/projects/:id/members/:userId` | Admin | Remove member |
| GET | `/projects/:projectId/tasks` | Member/Admin | List tasks with filters |
| POST | `/projects/:projectId/tasks` | Admin | Create task |
| GET | `/projects/:projectId/tasks/:taskId` | Member/Admin | Task detail |
| PUT | `/projects/:projectId/tasks/:taskId` | Admin | Update task |
| PATCH | `/projects/:projectId/tasks/:taskId/status` | Admin/Assigned Member | Update status |
| DELETE | `/projects/:projectId/tasks/:taskId` | Admin | Delete task |
| GET | `/dashboard` | Auth | Dashboard stats and recent tasks |

## Screenshots (placeholders)

- `docs/screenshots/login.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/projects.png`
- `docs/screenshots/project-board.png`
- `docs/screenshots/project-settings.png`

## Notes

- JWT is stored in `localStorage` and sent via `Authorization: Bearer <token>`.
- Frontend has protected routes, loading states, empty states, and toast notifications.
- Project role model is enforced per-project (`admin` and `member`).

## Live Demo

- Frontend: https://your-frontend.up.railway.app
- Backend: https://your-backend.up.railway.app

## Test Credentials

Admin  -> admin@demo.com / Admin@123
Member -> member@demo.com / Member@123
