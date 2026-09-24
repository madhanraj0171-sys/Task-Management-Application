import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';

export const TaskDetails = ({ task, onBack, onEdit, onDelete, onStatusChange }) => {
  if (!task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="badge badge-pending">{task.status}</span>
          <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{task.priority} Priority</span>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
          {task.title}
        </h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>
            Description
          </h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#334155', whiteSpace: 'pre-wrap' }}>
            {task.description || <em style={{ color: '#94a3b8' }}>No description provided.</em>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#475569' }}>
          <div>
            <strong>Due Date:</strong> {formatDate(task.dueDate)}
          </div>
          <div>
            <strong>Created:</strong> {formatDate(task.createdAt)}
          </div>
          <div>
            <strong>Last Updated:</strong> {formatDate(task.updatedAt)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          {task.status !== 'Completed' ? (
            <button
              onClick={() => onStatusChange(task._id, 'Completed')}
              className="btn"
              style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
            >
              <CheckCircle2 size={16} /> Mark as Completed
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(task._id, 'Pending')}
              className="btn btn-secondary"
            >
              Reopen Task
            </button>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onEdit(task)} className="btn btn-secondary">
              <Edit2 size={15} /> Edit
            </button>
            <button onClick={() => onDelete(task)} className="btn btn-danger">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
