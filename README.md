# TaskFlow

> **"Plan your work. Track your progress."**

A full-stack Task Management Web Application developed for an online computer science internship project. TaskFlow helps individuals and small student teams organize, prioritize, and monitor daily tasks efficiently through an intuitive, clean, and distraction-free interface.

---

## 1. Project Description

TaskFlow is designed to bridge the gap between complex enterprise project management software and simple to-do lists. Built with a human-first, clean design aesthetic, the application provides secure authentication, comprehensive CRUD task operations, dynamic searching, multi-criteria filtering, and priority tracking without unnecessary animations, bloated cards, or fake statistics.

Each user enjoys a private workspace where they can only view and manage tasks created by themselves.

---

## 2. Features

- **Authentication & Security:**
  - User registration and login with JWT (JSON Web Tokens)
  - Passwords hashed using `bcrypt` (never stored in plain text)
  - Protected API routes ensuring strict user data isolation
  - Automatic session restoration with token verification

- **Dashboard:**
  - Time-aware personal greeting ("Good morning, [User Name]")
  - Real-time work metrics: Total Tasks, Pending, In Progress, and Completed
  - Quick-view of recent tasks with direct status updates

- **Complete Task CRUD:**
  - **Create:** Title, Description, Priority (Low, Medium, High), Status (Pending, In Progress, Completed), and Due Date
  - **Read:** Clean list view and detailed task modal with timestamps
  - **Update:** Edit task attributes and quick-toggle status directly from cards
  - **Delete:** Safe deletion with confirmation modal dialog

- **Search, Filter & Sorting:**
  - Real-time title search
  - Status filter (All, Pending, In Progress, Completed)
  - Priority filter (All, Low, Medium, High)
  - Sorting options (Newest First, Oldest First, Due Date)

- **Responsive & Accessible Design:**
  - Adapts cleanly to Mobile, Tablet, Laptop, and Desktop screens
  - Student-developed look: simple off-white background, subtle blue accent, legible typography, no glassmorphism or neon slop.

---

## 3. Technologies Used

### Frontend
- **React.js (v19)** with Functional Components & Hooks
- **Vite** for fast modern bundling
- **CSS / Tailwind CSS** for clean, practical styling
- **Lucide React** for lightweight icons

### Backend
- **Node.js** runtime environment
- **Express.js** web application framework
- **JWT (jsonwebtoken)** for stateless authentication
- **bcrypt / bcryptjs** for cryptographic password hashing
- **CORS** middleware for secure cross-origin requests

### Database
- **MongoDB** with **Mongoose** Object Data Modeling (ODM)

---

## 4. Authentication Architecture

1. **Registration:**
   - Client sends `name`, `email`, and `password` to `/api/auth/register`.
   - Backend checks if email is already taken.
   - Salt generated with `bcrypt.genSalt(10)` and password hashed before database insertion.
   - Signed JWT token (30-day validity) returned to client.

2. **Login:**
   - Client sends credentials to `/api/auth/login`.
   - Server verifies email exists and compares candidate password with `bcrypt.compare()`.
   - JWT token issued upon successful verification.

3. **Protected Routes:**
   - Client stores token in `localStorage` and includes it in HTTP request headers:
     ```http
     Authorization: Bearer <token>
     ```
   - Express middleware (`authMiddleware.js`) intercepts requests, verifies token validity, and attaches the authenticated user record to `req.user`.

---

## 5. Task CRUD Functionality

| Operation | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| **Create** | `POST` | `/api/tasks` | Create a new task assigned to authenticated user |
| **Read All** | `GET` | `/api/tasks` | Retrieve user tasks with optional search, status, priority, and sort |
| **Read One** | `GET` | `/api/tasks/:id` | Fetch details of a single task belonging to user |
| **Update** | `PUT` | `/api/tasks/:id` | Update title, description, priority, status, or due date |
| **Quick Status** | `PATCH` | `/api/tasks/:id/status` | Quickly change status (Pending / In Progress / Completed) |
| **Delete** | `DELETE` | `/api/tasks/:id` | Permanently remove a task after user confirmation |

---

## 6. Folder Structure

```
TaskFlow/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile logic
│   │   └── taskController.js     # Task CRUD, filters, and user isolation
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # Mongoose schema for User
│   │   └── Task.js               # Mongoose schema for Task
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── taskRoutes.js         # /api/tasks routes
│   ├── .env.example              # Sample backend environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server & MongoDB connection
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header with user greeting
│   │   │   ├── ProtectedRoute.jsx# Client-side route guard
│   │   │   ├── TaskCard.jsx      # Individual task card representation
│   │   │   ├── TaskFilter.jsx    # Search, filter, and sort bar
│   │   │   └── TaskForm.jsx      # Reusable create & edit task form
│   │   ├── pages/
│   │   │   ├── AddTask.jsx       # Dedicated page to create a task
│   │   │   ├── Dashboard.jsx     # Overview with metrics & recent tasks
│   │   │   ├── Login.jsx         # User login form
│   │   │   ├── Register.jsx      # User registration form
│   │   │   ├── TaskDetails.jsx   # Detailed task view
│   │   │   └── Tasks.jsx         # My Tasks list with filters
│   │   ├── App.jsx               # Application coordinator
│   │   ├── main.jsx              # React DOM mounting
│   │   └── styles.css            # Human-crafted clean styles
│   ├── .env.example              # Sample frontend environment variables
│   └── package.json              # Frontend dependencies
│
├── .gitignore
└── README.md
```

---

## 7. MongoDB Setup

You can use either a local MongoDB Community server or MongoDB Atlas (free cloud database).

### Using MongoDB Atlas (Recommended):
1. Sign up for a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (e.g. `Cluster0`).
3. Under **Database Access**, create a database user with username and password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) or your current IP.
5. Click **Connect** → **Drivers** (Node.js) and copy the connection string.
6. Paste the connection string into `backend/.env` under `MONGO_URI`.

---

## 8. Environment Variables

### Backend (`backend/.env`):
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production_2026
PORT=5000
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

---

## 9. Installation & Local Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/<your-username>/taskflow.git
cd taskflow
```

---

## 10. Running the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret
npm run dev
```

The backend server will start on `http://localhost:5000`.

---

## 11. Running the Frontend

In a separate terminal window:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend application will start on `http://localhost:5173`. Open this URL in your web browser.

---

## 12. API Endpoints Reference

### Auth Endpoints
- `POST /api/auth/register` - Create new user account
  - **Body:** `{ "name": "Alex", "email": "alex@college.edu", "password": "secretpassword" }`
- `POST /api/auth/login` - Authenticate user & get JWT token
  - **Body:** `{ "email": "alex@college.edu", "password": "secretpassword" }`
- `GET /api/auth/profile` - Get logged-in user profile (requires Bearer token)

### Task Endpoints
- `GET /api/tasks` - Retrieve tasks (Query parameters: `search`, `status`, `priority`, `sort`)
- `GET /api/tasks/:id` - Retrieve single task by ID
- `POST /api/tasks` - Create task
  - **Body:** `{ "title": "Math Homework", "description": "Exercises 1-10", "priority": "High", "status": "Pending", "dueDate": "2026-10-01" }`
- `PUT /api/tasks/:id` - Update task details
- `PATCH /api/tasks/:id/status` - Quick update task status (`Pending` / `In Progress` / `Completed`)
- `DELETE /api/tasks/:id` - Delete task

---

## 13. GitHub Upload Instructions

To upload this project to your GitHub repository:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add files
git add .

# 3. Commit changes
git commit -m "feat: complete TaskFlow MERN task management application"

# 4. Link your GitHub remote repository
git remote add origin https://github.com/<your-username>/taskflow.git

# 5. Push to main branch
git branch -M main
git push -u origin main
```

---

## 14. Deployment Instructions

### Backend (Render / Railway / Render.com):
1. Create a new Web Service pointing to your GitHub repository.
2. Set Root Directory to `backend`.
3. Set Build Command: `npm install`.
4. Set Start Command: `node server.js`.
5. Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`.

### Frontend (Vercel / Netlify):
1. Connect repository to Vercel or Netlify.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add Environment Variable: `VITE_API_URL=https://your-backend-service.onrender.com`.

---

## 15. Internship Evaluation Summary

- **Architecture:** Clean Separation of Concerns (MVC: Models, Views, Controllers, Routes, Middleware).
- **Security:** Standard password salt & hashing with bcrypt; stateful authorization via JWT.
- **Privacy:** Every database query enforces user ownership validation.
- **User Experience:** Instant feedback, friendly error states, confirmation safeguards, zero visual clutter.
