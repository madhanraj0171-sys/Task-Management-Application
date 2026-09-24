import React from 'react';
import { Search } from 'lucide-react';

export const TaskFilter = ({ filters, onChange, onReset }) => {
  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks by title..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '130px' }}>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div style={{ minWidth: '130px' }}>
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div style={{ minWidth: '150px' }}>
          <select
            className="form-select"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="dueDate">Sort: Due Date</option>
          </select>
        </div>

        <button type="button" className="btn btn-secondary" onClick={onReset} style={{ fontSize: '0.8125rem' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;
