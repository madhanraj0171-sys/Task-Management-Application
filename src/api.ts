import { Task, TaskFilterOptions, User } from './types';

// Use relative API path when served from same host (works in both dev Vite and prod Express)
// Or use VITE_API_URL if explicitly specified
const API_BASE = import.meta.env.VITE_API_URL || '';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('taskflow_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Received an invalid response from server.');
  }

  if (!res.ok) {
    const errorMsg = data?.message || `Server request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const authApi = {
  async register(name: string, email: string, password: string): Promise<User & { token: string }> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse<User & { token: string }>(res);
  },

  async login(email: string, password: string): Promise<User & { token: string }> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<User & { token: string }>(res);
  },

  async getProfile(): Promise<User> {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<User>(res);
  },
};

export const taskApi = {
  async getTasks(filters?: Partial<TaskFilterOptions>): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters?.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters?.sort) params.append('sort', filters.sort);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/api/tasks${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<Task[]>(res);
  },

  async getTaskById(id: string): Promise<Task> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<Task>(res);
  },

  async createTask(taskData: {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string | null;
  }): Promise<Task> {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse<Task>(res);
  },

  async updateTask(
    id: string,
    taskData: Partial<{
      title: string;
      description: string;
      priority: string;
      status: string;
      dueDate: string | null;
    }>
  ): Promise<Task> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse<Task>(res);
  },

  async deleteTask(id: string): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string; id: string }>(res);
  },

  async updateStatus(id: string, status: string): Promise<Task> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<Task>(res);
  },
};
