import React from 'react';
import TaskForm from '../components/TaskForm';
import { ArrowLeft } from 'lucide-react';

export const AddTask = ({ onBack, onCreateTask, isSubmitting }) => {
  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="card" style={{ padding: '1.75rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create New Task</h1>
        <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
          Add details about what you need to get done.
        </p>

        <TaskForm onSubmit={onCreateTask} onCancel={onBack} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default AddTask;
