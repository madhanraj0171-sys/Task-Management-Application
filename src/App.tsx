import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { AddTask } from './pages/AddTask';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { EditTaskModal } from './components/EditTaskModal';
import { DeleteModal } from './components/DeleteModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { Task, TaskFilterOptions, TaskPriority, TaskStatus } from './types';
import { taskApi } from './api';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Navigation state: 'dashboard' | 'tasks' | 'add'
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tasks' | 'add'>('dashboard');

  // Task data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(false);

  // Filters state
  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: '',
    status: 'All',
    priority: 'All',
    sort: 'newest',
  });

  // Modals state
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsTasksLoading(true);
    try {
      const data = await taskApi.getTasks(filters);
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast('error', err.message);
      } else {
        addToast('error', 'Failed to retrieve tasks.');
      }
    } finally {
      setIsTasksLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  // Handle task creation
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string | null;
  }) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      addToast('success', 'Task created successfully.');
      setCurrentTab('tasks');
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast('error', err.message);
      } else {
        addToast('error', 'Could not create task.');
      }
      throw err;
    }
  };

  // Handle task update
  const handleUpdateTask = async (
    id: string,
    taskData: {
      title: string;
      description: string;
      priority: TaskPriority;
      status: TaskStatus;
      dueDate: string | null;
    }
  ) => {
    try {
      const updated = await taskApi.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      addToast('success', 'Task updated successfully.');
      if (selectedTaskForDetails && selectedTaskForDetails._id === id) {
        setSelectedTaskForDetails(updated);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast('error', err.message);
      } else {
        addToast('error', 'Could not update task.');
      }
      throw err;
    }
  };

  // Handle quick status change
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      const updated = await taskApi.updateStatus(id, newStatus);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      if (selectedTaskForDetails && selectedTaskForDetails._id === id) {
        setSelectedTaskForDetails(updated);
      }
      addToast('success', `Task marked as ${newStatus}.`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast('error', err.message);
      } else {
        addToast('error', 'Could not update task status.');
      }
    }
  };

  // Handle task deletion
  const handleDeleteConfirm = async () => {
    if (!selectedTaskForDelete) return;
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(selectedTaskForDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== selectedTaskForDelete._id));
      if (selectedTaskForDetails && selectedTaskForDetails._id === selectedTaskForDelete._id) {
        setSelectedTaskForDetails(null);
      }
      setSelectedTaskForDelete(null);
      addToast('success', 'Task deleted successfully.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast('error', err.message);
      } else {
        addToast('error', 'Could not delete task.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (updated: Partial<TaskFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      sort: 'newest',
    });
  };

  // Loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading TaskFlow...</p>
      </div>
    );
  }

  // If user is not logged in, show Login or Register
  if (!user) {
    return (
      <>
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
        <NotificationToast toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            isLoading={isTasksLoading}
            onNavigate={(tab) => setCurrentTab(tab)}
            onEditTask={(task) => setSelectedTaskForEdit(task)}
            onDeleteTask={(task) => setSelectedTaskForDelete(task)}
            onViewTask={(task) => setSelectedTaskForDetails(task)}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentTab === 'tasks' && (
          <Tasks
            tasks={tasks}
            isLoading={isTasksLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onNavigate={(tab) => setCurrentTab(tab)}
            onEditTask={(task) => setSelectedTaskForEdit(task)}
            onDeleteTask={(task) => setSelectedTaskForDelete(task)}
            onViewTask={(task) => setSelectedTaskForDetails(task)}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentTab === 'add' && (
          <AddTask
            onBack={() => setCurrentTab('dashboard')}
            onCreateTask={handleCreateTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TaskFlow &copy; {new Date().getFullYear()} - Plan your work. Track your progress.</span>
          <span className="text-slate-400">CSE Internship Project • MERN Stack & JWT Authentication</span>
        </div>
      </footer>

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTaskForDetails}
        isOpen={Boolean(selectedTaskForDetails)}
        onClose={() => setSelectedTaskForDetails(null)}
        onEdit={(task) => {
          setSelectedTaskForDetails(null);
          setSelectedTaskForEdit(task);
        }}
        onDelete={(task) => {
          setSelectedTaskForDetails(null);
          setSelectedTaskForDelete(task);
        }}
        onStatusChange={handleStatusChange}
      />

      <EditTaskModal
        task={selectedTaskForEdit}
        isOpen={Boolean(selectedTaskForEdit)}
        onClose={() => setSelectedTaskForEdit(null)}
        onUpdate={handleUpdateTask}
      />

      <DeleteModal
        task={selectedTaskForDelete}
        isOpen={Boolean(selectedTaskForDelete)}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedTaskForDelete(null)}
        isDeleting={isDeleting}
      />

      <NotificationToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
