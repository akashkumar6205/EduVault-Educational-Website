# Full-Stack Application (React + Node.js/Express + MongoDB)

A structured boilerplate connecting a React (Vite) frontend with an Express/Node.js backend and MongoDB database, styled with Tailwind CSS.

---

## Project Structure

```
notes/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   └── health.controller.js  # Controller returning API & DB connection status
│   │   ├── routes/
│   │   │   ├── health.routes.js      # Health check endpoint (/api/health)
│   │   │   └── index.js              # Aggregated API router
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # Server entry point
│   ├── .env                          # Backend environment variables
│   ├── .env.example                  # Backend environment template
│   └── package.json                  # Backend dependencies and scripts
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js                # Axios API client configured to communicate with backend
│   │   ├── App.jsx                   # Component displaying live connection status to backend & DB
│   │   ├── index.css                 # Tailwind CSS directives
│   │   └── main.jsx                  # React DOM entry point
│   ├── .env                          # Frontend environment variables
│   ├── .env.example                  # Frontend environment template
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── vite.config.js                # Vite build configuration
│   └── package.json                  # Frontend dependencies and scripts
│
├── package.json                      # Root scripts for running frontend and backend
├── .gitignore                        # Git ignore rules
└── README.md                         # Documentation
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

### 2. Environment Setup

#### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notes_db
CLIENT_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running the Application

### Option A: Using Root Scripts
Open two terminal windows in the project root:

- **Start Backend:**
  ```bash
  npm run dev:backend
  ```

- **Start Frontend:**
  ```bash
  npm run dev:frontend
  ```

### Option B: Running Separately

- **Backend:**
  ```bash
  cd backend
  npm run dev
  ```
  Runs at: `http://localhost:5000`

- **Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
  Runs at: `http://localhost:5173`

---

## API Endpoints

- **`GET /api/health`**: Returns JSON with backend uptime and MongoDB connection state:
  ```json
  {
    "success": true,
    "message": "Backend API is up and running",
    "timestamp": "2026-10-16T...",
    "database": {
      "status": "connected",
      "readyState": 1,
      "connected": true
    }
  }
  ```
