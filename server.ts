import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_dev_secret_jwt_key_2026';

// Middlewares
app.use(cors());
app.use(express.json());

// Persistent Local Data Store (ensures 100% reliable functionality without requiring external DB cluster setup)
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  password: string; // bcrypt hashed
  createdAt: string;
}

interface TaskRecord {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null;
  user: string; // User ID
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  tasks: TaskRecord[];
}

function initDB(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    // Initial starter database with a demo account for quick evaluation
    const demoHashedPassword = bcrypt.hashSync('student123', 10);
    const demoUserId = 'user_demo_intern_1';
    const now = new Date();
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
    const inTwoDays = new Date(Date.now() + 2 * 24 * 3600 * 1000);
    const inFiveDays = new Date(Date.now() + 5 * 24 * 3600 * 1000);

    const initialData: DatabaseSchema = {
      users: [
        {
          _id: demoUserId,
          name: 'Alex Johnson',
          email: 'alex.student@college.edu',
          password: demoHashedPassword,
          createdAt: yesterday.toISOString()
        }
      ],
      tasks: [
        {
          _id: 'task_1',
          title: 'Review Project Documentation',
          description: 'Go through the internship project specifications and prepare questions for the team lead.',
          status: 'In Progress',
          priority: 'High',
          dueDate: inTwoDays.toISOString().split('T')[0],
          user: demoUserId,
          createdAt: yesterday.toISOString(),
          updatedAt: now.toISOString()
        },
        {
          _id: 'task_2',
          title: 'Implement Database Connection',
          description: 'Set up MongoDB connection strings, error handling, and test with local database.',
          status: 'Completed',
          priority: 'Medium',
          dueDate: yesterday.toISOString().split('T')[0],
          user: demoUserId,
          createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          updatedAt: yesterday.toISOString()
        },
        {
          _id: 'task_3',
          title: 'Write Unit Tests for Auth API',
          description: 'Test registration, login with bcrypt password validation, and JWT token authorization headers.',
          status: 'Pending',
          priority: 'Low',
          dueDate: inFiveDays.toISOString().split('T')[0],
          user: demoUserId,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], tasks: [] };
  }
}

function saveDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

let db = initDB();

// Helper to generate token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

// Express Custom Request Interface for Auth
interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

// Authentication Middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.users.find(u => u._id === decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found or token has expired.' });
      return;
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired authorization token.' });
    return;
  }
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide full name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      res.status(400).json({ message: 'An account with this email already exists.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser: UserRecord = {
      _id: userId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    const token = generateToken(newUser._id);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please enter both email and password.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/auth/profile
app.get('/api/auth/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.json(req.user);
});

// ==========================================
// TASK ROUTES
// ==========================================

// GET /api/tasks - Retrieve user's tasks with search, filter, and sorting
app.get('/api/tasks', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { search, status, priority, sort } = req.query;

    // Filter strictly to current user's tasks
    let userTasks = db.tasks.filter(t => t.user === userId);

    // Search filter
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      userTasks = userTasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (status && status !== 'All') {
      userTasks = userTasks.filter(t => t.status === status);
    }

    // Priority filter
    if (priority && priority !== 'All') {
      userTasks = userTasks.filter(t => t.priority === priority);
    }

    // Sorting
    if (sort === 'oldest') {
      userTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'dueDate') {
      userTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else {
      // Default: newest
      userTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json(userTasks);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ message: 'Failed to retrieve tasks.' });
  }
});

// GET /api/tasks/:id - Retrieve single task
app.get('/api/tasks/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const task = db.tasks.find(t => t._id === req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    if (task.user !== userId) {
      res.status(403).json({ message: 'Unauthorized: You do not have permission to view this task.' });
      return;
    }

    res.json(task);
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ message: 'Failed to fetch task details.' });
  }
});

// POST /api/tasks - Create task
app.post('/api/tasks', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ message: 'Task title is required.' });
      return;
    }

    const validStatus = ['Pending', 'In Progress', 'Completed'].includes(status) ? status : 'Pending';
    const validPriority = ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium';

    const now = new Date().toISOString();
    const newTask: TaskRecord = {
      _id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: validPriority,
      status: validStatus,
      dueDate: dueDate || null,
      user: userId,
      createdAt: now,
      updatedAt: now
    };

    db.tasks.unshift(newTask);
    saveDB(db);

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task.' });
  }
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const taskIndex = db.tasks.findIndex(t => t._id === req.params.id);

    if (taskIndex === -1) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    const task = db.tasks[taskIndex];
    if (task.user !== userId) {
      res.status(403).json({ message: 'Unauthorized: You can only edit your own tasks.' });
      return;
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ message: 'Task title cannot be empty.' });
        return;
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      task.priority = priority;
    }

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      task.status = status;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    task.updatedAt = new Date().toISOString();
    db.tasks[taskIndex] = task;
    saveDB(db);

    res.json(task);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task.' });
  }
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const taskIndex = db.tasks.findIndex(t => t._id === req.params.id);

    if (taskIndex === -1) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    if (db.tasks[taskIndex].user !== userId) {
      res.status(403).json({ message: 'Unauthorized: You can only delete your own tasks.' });
      return;
    }

    db.tasks.splice(taskIndex, 1);
    saveDB(db);

    res.json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Failed to delete task.' });
  }
});

// PATCH /api/tasks/:id/status - Quick status update
app.patch('/api/tasks/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      res.status(400).json({ message: 'Invalid status provided.' });
      return;
    }

    const task = db.tasks.find(t => t._id === req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    if (task.user !== userId) {
      res.status(403).json({ message: 'Unauthorized.' });
      return;
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();
    saveDB(db);

    res.json(task);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Failed to update task status.' });
  }
});

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite Middleware integration for development and static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskFlow Server running on port ${PORT}`);
  });
}

startServer();
