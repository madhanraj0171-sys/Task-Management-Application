import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Loader2 } from 'lucide-react';

interface TaskFormProps {
  initialTask?: Task | null;
  onSubmit: (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string | null;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [description, setDescription] = useState(initialTask ? initialTask.description : '');
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask ? initialTask.priority : 'Medium'
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialTask ? initialTask.status : 'Pending'
  );
  const [dueDate, setDueDate] = useState<string>(
    initialTask && initialTask.dueDate ? initialTask.dueDate.split('T')[0] : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate ? dueDate : null,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while saving the task.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-rose-50 border border-rose-200 text-rose-700 rounded-md">
          {error}
        </div>
      )}

      {/* Task Title */}
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 mb-1">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. Complete module 3 presentation slides"
          maxLength={100}
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
          required
        />
        <div className="flex justify-between items-center mt-1 text-xs text-slate-400">
          <span>Brief, descriptive summary of the task</span>
          <span>{title.length}/100</span>
        </div>
      </div>

      {/* Task Description */}
      <div>
        <label htmlFor="task-desc" className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          id="task-desc"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide any additional notes, requirements, or steps required to finish this task..."
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
        />
      </div>

      {/* Row with Priority, Status, and Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Priority */}
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="task-duedate" className="block text-sm font-medium text-slate-700 mb-1">
            Due Date
          </label>
          <input
            id="task-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
        </button>
      </div>
    </form>
  );
};
