import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size='md'/>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              User Login
            </Link>
            <Link to="/alogin"
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col gap-1">
            <Link to="/login" onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
              User Login
            </Link>
            <Link to="/alogin" onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg">
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;