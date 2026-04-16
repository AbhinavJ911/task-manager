# 📋 Task Manager

A full-stack task management application built with the **MERN stack** (MongoDB, Express, React, Node.js), featuring Google OAuth authentication, Stripe subscription payments, and a premium analytics dashboard.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express 5, Passport.js |
| **Database** | MongoDB Atlas |
| **Auth** | JWT + Google OAuth 2.0 |
| **Payments** | Stripe |

---

## 🐳 Running with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

### Step 1: Clone the Repository

```bash
git clone https://github.com/AbhinavJ911/task-manager.git
cd task-manager
```

### Step 2: Set Up Environment Variables

Create the backend `.env` file:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

### Step 3: Build and Run

```bash
# Build and start all containers
docker compose up --build

# Or run in the background (detached mode)
docker compose up --build -d
```

### Step 4: Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | [http://localhost:3000](http://localhost:3000) |
| **Backend API** | [http://localhost:5000](http://localhost:5000) |

### Stopping the Application

```bash
# Stop containers (if running in foreground, press Ctrl+C)
docker compose down

# Stop and remove volumes
docker compose down -v
```

### Rebuilding After Changes

```bash
# Rebuild images and restart
docker compose up --build
```

### Viewing Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs frontend

# Follow logs in real-time
docker compose logs -f
```

---

## 💻 Running without Docker (Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your credentials
npm run dev             # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, Passport config
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   └── server.js         # Express entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── App.jsx           # Root component
│   ├── .env.example
│   └── package.json
├── Dockerfile.backend        # Backend container image
├── Dockerfile.frontend       # Frontend multi-stage build
├── docker-compose.yml        # Orchestration config
├── nginx.conf                # Nginx config for frontend
├── .dockerignore             # Excludes from Docker build
└── README.md
```

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `FRONTEND_URL` | Frontend URL for CORS (`http://localhost:3000` for Docker) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SESSION_SECRET` | Express session secret |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable API key |

---

## 📝 License

ISC
