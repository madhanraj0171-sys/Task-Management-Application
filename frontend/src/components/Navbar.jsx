import React, { useState } from 'react';
import { CheckSquare, LayoutDashboard, ListTodo, PlusCircle, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

export const Navbar = ({ currentTab, onNavigate, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div
            onClick={() => onNavigate('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <div style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
              <CheckSquare size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a', display: 'block', lineHeight: 1 }}>TaskFlow</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Plan your work. Track your progress.</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="nav-links" style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={currentTab === 'dashboard' ? 'active' : ''}
              onClick={() => onNavigate('dashboard')}
            >
              <LayoutDashboard size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Dashboard
            </button>
            <button
              className={currentTab === 'tasks' ? 'active' : ''}
              onClick={() => onNavigate('tasks')}
            >
              <ListTodo size={16} style={{ display: 'inline', marginRight: '6px' }} />
              My Tasks
            </button>
            <button
              className={currentTab === 'add' ? 'active' : ''}
              onClick={() => onNavigate('add')}
            >
              <PlusCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Add Task
            </button>
          </div>
        </div>

        {/* Right side user info & logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <UserIcon size={14} color="#64748b" />
              <span style={{ fontWeight: 500, color: '#334155' }}>{user.name}</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
