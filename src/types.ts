export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskFilterOptions {
  search: string;
  status: string; // 'All' | TaskStatus
  priority: string; // 'All' | TaskPriority
  sort: 'newest' | 'oldest' | 'dueDate';
}
