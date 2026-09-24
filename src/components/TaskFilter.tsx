import React from 'react';
import { TaskFilterOptions } from '../types';
import { Search, RotateCcw } from 'lucide-react';

interface TaskFilterProps {
  filters: TaskFilterOptions;
  onChange: (updatedFilters: Partial<TaskFilterOptions>) => void;
  onReset: () => void;
  totalCount: number;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.sort !== 'newest';

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Status Filter */}
          <div>
            <select
              aria-label="Filter by Status"
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value })}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              aria-label="Filter by Priority"
              value={filters.priority}
              onChange={(e) => onChange({ priority: e.target.value })}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              aria-label="Sort by"
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value as 'newest' | 'oldest' | 'dueDate' })}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="dueDate">Sort: By Due Date</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button if active */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Showing count indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{totalCount}</strong> {totalCount === 1 ? 'task' : 'tasks'}
        </span>
        {isFiltered && <span className="text-blue-600 font-medium">Filtered results</span>}
      </div>
    </div>
  );
};
