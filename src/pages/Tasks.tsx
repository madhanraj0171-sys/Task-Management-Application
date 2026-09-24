import React from 'react';
import { Task, TaskFilterOptions, TaskStatus } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TaskFilter } from '../components/TaskFilter';
import { PlusCircle, Loader2, ClipboardX } from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  isLoading: boolean;
  filters: TaskFilterOptions;
  onFilterChange: (filters: Partial<TaskFilterOptions>) => void;
  onResetFilters: () => void;
  onNavigate: (tab: 'dashboard' | 'tasks' | 'add') => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const Tasks: React.FC<TasksProps> = ({
  tasks,
  isLoading,
  filters,
  onFilterChange,
  onResetFilters,
  onNavigate,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            View, search, filter, and organize all your assigned assignments and work.
          </p>
        </div>

        <button
          onClick={() => onNavigate('add')}
          className="flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Component */}
      <TaskFilter
        filters={filters}
        onChange={onFilterChange}
        onReset={onResetFilters}
        totalCount={tasks.length}
      />

      {/* Task List Content */}
      {isLoading ? (
        <div className="py-20 bg-white border border-slate-200 rounded-md flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-16 px-4 bg-white border border-slate-200 rounded-md text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <ClipboardX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">No tasks found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            {filters.search || filters.status !== 'All' || filters.priority !== 'All'
              ? 'No tasks matched your current search or filter criteria. Try clearing the filters.'
              : 'You have not added any tasks yet. Plan your day by creating your first task.'}
          </p>

          {filters.search || filters.status !== 'All' || filters.priority !== 'All' ? (
            <button
              onClick={onResetFilters}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={() => onNavigate('add')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create your first task</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
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
  );
};
