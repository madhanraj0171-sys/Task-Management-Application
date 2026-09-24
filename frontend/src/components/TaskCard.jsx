import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const TaskCard = ({ task, onEdit, onDelete, onViewDetails, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusClass = (status) => {
    if (status === 'Completed') return 'badge-completed';
    if (status === 'In Progress') return 'badge-progress';
    return 'badge-pending';
  };

  const getPriorityStyle = (priority) => {
    if (priority === 'High') return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
    if (priority === 'Medium') return { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
    return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={`badge ${getStatusClass(task.status)}`}>{task.status}</span>
            <span className="badge" style={getPriorityStyle(task.priority)}>{task.priority} Priority</span>
          </div>

          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
        </div>

        <h3
          onClick={() => onViewDetails(task)}
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: task.status === 'Completed' ? '#94a3b8' : '#0f172a',
            textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}
        >
          {task.title}
        </h3>

        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          {task.description || <em style={{ color: '#94a3b8' }}>No description</em>}
        </p>
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} /> Due: {formatDate(task.dueDate)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {task.status !== 'Completed' && onStatusChange && (
            <button
              onClick={() => onStatusChange(task._id, 'Completed')}
              style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer' }}
              title="Mark as Completed"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(task)}
            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
