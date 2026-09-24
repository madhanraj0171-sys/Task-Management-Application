import React from 'react';
import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';
import { PlusCircle } from 'lucide-react';

export const Tasks = ({
  tasks,
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Tasks</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Search, filter, and track all your tasks</p>
        </div>

        <button className="btn btn-primary" onClick={() => onNavigate('add')}>
          <PlusCircle size={16} />
          Create Task
        </button>
      </div>

      <TaskFilter filters={filters} onChange={onFilterChange} onReset={onResetFilters} />

      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No tasks found.</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Get started by creating your first task or clear your search filters.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('add')}>
            <PlusCircle size={16} />
            Create your first task
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
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

export default Tasks;
