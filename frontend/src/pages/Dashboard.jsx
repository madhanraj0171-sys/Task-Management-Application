import React from 'react';
import TaskCard from '../components/TaskCard';
import { PlusCircle, ListTodo, Clock, Hourglass, CheckCircle2 } from 'lucide-react';

export const Dashboard = ({ tasks, user, onNavigate, onEditTask, onDeleteTask, onViewTask, onStatusChange }) => {
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Good morning, {user ? user.name : 'Student'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Here is what you need to work on today.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onNavigate('add')}>
          <PlusCircle size={16} />
          Create Task
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>TOTAL TASKS</span>
            <ListTodo size={16} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>{totalTasks}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>PENDING</span>
            <Clock size={16} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#b45309' }}>{pendingTasks}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>IN PROGRESS</span>
            <Hourglass size={16} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#1d4ed8' }}>{inProgressTasks}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#047857', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>COMPLETED</span>
            <CheckCircle2 size={16} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#047857' }}>{completedTasks}</div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Tasks</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Latest tasks on your workspace</p>
          </div>
          {tasks.length > 0 && (
            <button
              onClick={() => onNavigate('tasks')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
            >
              View all tasks &rarr;
            </button>
          )}
        </div>

        {recentTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>No tasks found.</p>
            <button className="btn btn-primary" onClick={() => onNavigate('add')}>
              Create your first task
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {recentTasks.map((task) => (
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
    </div>
  );
};

export default Dashboard;
