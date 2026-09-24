import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
}) => {
  // Format dates cleanly
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Status visual styling (subtle, clean, not overly colorful)
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  // Priority visual styling
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isOverdue =
    task.dueDate &&
    task.status !== 'Completed' &&
    new Date(task.dueDate).setHours(23, 59, 59, 999) < new Date().getTime();

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Badges & Status Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getStatusBadge(
                task.status
              )}`}
            >
              {task.status}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-sm font-medium border ${getPriorityBadge(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
          </div>

          {/* Quick status selector */}
          {onStatusChange && (
            <select
              aria-label="Change task status"
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
              onClick={(e) => e.stopPropagation()}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(task)}
          className={`font-semibold text-base text-slate-900 mb-1.5 cursor-pointer hover:text-blue-600 transition-colors ${
            task.status === 'Completed' ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Short description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {task.description || <span className="italic text-slate-400">No description provided</span>}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`flex items-center gap-1 ${
              isOverdue ? 'text-rose-600 font-semibold' : ''
            }`}
            title={isOverdue ? 'This task is past due date!' : 'Due Date'}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400" title="Created date">
            <Clock className="w-3.5 h-3.5" />
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onViewDetails(task)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs flex items-center gap-1 transition-colors"
            title="View Details"
          >
            <span>View</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          {task.status !== 'Completed' && onStatusChange && (
            <button
              onClick={() => onStatusChange(task._id, 'Completed')}
              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              title="Mark as Completed"
              aria-label="Mark as Completed"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(task)}
            className="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
