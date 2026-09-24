import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import TaskDetails from './pages/TaskDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'tasks' | 'add' | 'details'
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'All', priority: 'All', sort: 'newest' });

  // Load user profile on mount if token exists
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session expired');
          return res.json();
        })
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('taskflow_token');
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  // Load tasks when authenticated
  const loadTasks = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== 'All') params.append('status', filters.status);
      if (filters.priority !== 'All') params.append('priority', filters.priority);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token, filters]);

  // Auth actions
  const handleLogin = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('taskflow_token', data.token);
    setToken(data.token);
    setUser(data);
  };

  const handleRegister = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('taskflow_token', data.token);
    setToken(data.token);
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow_token');
    setToken(null);
    setUser(null);
  };

  // Task actions
  const handleCreateTask = async (taskData) => {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setCurrentTab('tasks');
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    const res = await fetch(`${API_BASE}/api/tasks/${task._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setTasks(tasks.filter((t) => t._id !== task._id));
      if (selectedTask?._id === task._id) {
        setSelectedTask(null);
        setCurrentTab('tasks');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
      if (selectedTask?._id === id) setSelectedTask(updated);
    }
  };

  if (!token || !user) {
    return authView === 'login' ? (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div>
      <Navbar currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} user={user} onLogout={handleLogout} />

      <main className="container" style={{ padding: '2rem 1rem' }}>
        {currentTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            user={user}
            onNavigate={(tab) => setCurrentTab(tab)}
            onEditTask={(task) => {
              setSelectedTask(task);
              setCurrentTab('details');
            }}
            onDeleteTask={handleDeleteTask}
            onViewTask={(task) => {
              setSelectedTask(task);
              setCurrentTab('details');
            }}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentTab === 'tasks' && (
          <Tasks
            tasks={tasks}
            filters={filters}
            onFilterChange={(f) => setFilters({ ...filters, ...f })}
            onResetFilters={() => setFilters({ search: '', status: 'All', priority: 'All', sort: 'newest' })}
            onNavigate={(tab) => setCurrentTab(tab)}
            onEditTask={(task) => {
              setSelectedTask(task);
              setCurrentTab('details');
            }}
            onDeleteTask={handleDeleteTask}
            onViewTask={(task) => {
              setSelectedTask(task);
              setCurrentTab('details');
            }}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentTab === 'add' && (
          <AddTask onBack={() => setCurrentTab('dashboard')} onCreateTask={handleCreateTask} />
        )}

        {currentTab === 'details' && selectedTask && (
          <TaskDetails
            task={selectedTask}
            onBack={() => setCurrentTab('tasks')}
            onEdit={() => {}}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}
