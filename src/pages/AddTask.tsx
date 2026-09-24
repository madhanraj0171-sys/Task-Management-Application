import React, { useState } from 'react';
import { TaskForm } from '../components/TaskForm';
import { TaskPriority, TaskStatus } from '../types';
import { ArrowLeft, PlusCircle } from 'lucide-react';

interface AddTaskProps {
  onBack: () => void;
  onCreateTask: (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string | null;
  }) => Promise<void>;
}

export const AddTask: React.FC<AddTaskProps> = ({ onBack, onCreateTask }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string | null;
  }) => {
    setIsSubmitting(true);
    try {
      await onCreateTask(taskData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
          <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Create New Task</h1>
            <p className="text-xs text-slate-500">Add a new item to your personal task list</p>
          </div>
        </div>

        <TaskForm
          onSubmit={handleSubmit}
          onCancel={onBack}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
