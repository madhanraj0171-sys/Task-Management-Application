import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LayoutDashboard, ListTodo, PlusCircle, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'tasks' | 'add';
  onNavigate: (tab: 'dashboard' | 'tasks' | 'add') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'dashboard' | 'tasks' | 'add') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Brand */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2 text-left focus:outline-hidden group"
            >
              <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-blue-700 transition-colors">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xl text-slate-900 tracking-tight block leading-tight">
                  TaskFlow
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:block leading-none">
                  Plan your work. Track your progress.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => handleNavClick('tasks')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'tasks'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                My Tasks
              </button>

              <button
                onClick={() => handleNavClick('add')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'add'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Right User & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-md text-sm text-slate-700 border border-slate-200">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span className="font-medium max-w-[140px] truncate" title={user.name}>
                  {user.name}
                </span>
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 hover:border-rose-200 transition-colors"
              title="Logout from TaskFlow"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {user && (
            <div className="py-2 px-3 mb-2 bg-slate-50 rounded-md text-xs text-slate-600 border border-slate-200">
              Signed in as: <strong className="text-slate-900 block truncate">{user.name} ({user.email})</strong>
            </div>
          )}

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
              currentTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => handleNavClick('tasks')}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
              currentTab === 'tasks'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            My Tasks
          </button>

          <button
            onClick={() => handleNavClick('add')}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
              currentTab === 'add'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Add Task
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
