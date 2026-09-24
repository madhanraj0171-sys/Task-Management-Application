import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Task, TaskStatus } from '../types';
import { TaskCard } from '../components/TaskCard';
import {
  CheckCircle2,
  Clock,
  Hourglass,
  ListTodo,
  PlusCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  isLoading: boolean;
  onNavigate: (tab: 'dashboard' | 'tasks' | 'add') => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  isLoading,
  onNavigate,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onStatusChange,
}) => {
  const { user } = useAuth();

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute exact metrics for this user
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  // Recent tasks (top 4 latest)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Here is what you need to work on today.
          </p>
        </div>

        <div>
          <button
            onClick={() => onNavigate('add')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* Summary Information Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : totalTasks}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">All tasks created</span>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{isLoading ? '-' : pendingTasks}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Awaiting start</span>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Hourglass className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{isLoading ? '-' : inProgressTasks}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Currently active</span>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{isLoading ? '-' : completedTasks}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Finished tasks</span>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Tasks</h2>
            <p className="text-xs text-slate-500">Your latest updated and created tasks</p>
          </div>

          {tasks.length > 0 && (
            <button
              onClick={() => onNavigate('tasks')}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-xs text-slate-500">Loading your tasks...</p>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-600 mb-3">No tasks found. Get started by planning your first task.</p>
            <button
              onClick={() => onNavigate('add')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create your first task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onViewDetails={onViewTask}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
