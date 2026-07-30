import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="sticky top-0 z-50 px-6 py-4 border-b border-gray-100" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.75)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
        <span className="text-emerald-500">Budget</span>
        <span className="text-violet-400"> Buddy</span>
        </h1>
        <div className = "flex gap-6">
          <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-violet-50 text-violet-600' : 'text-gray-500 hover:text-gray-800'}`}>
            Dashboard
          </Link>
          <Link to="/transactions" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/transactions' ? 'bg-violet-50 text-violet-600' : 'text-gray-500 hover:text-gray-800'}`}>
            Transactions
          </Link>
          <Link to="/categories" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/categories' ? 'bg-violet-50 text-violet-600' : 'text-gray-500 hover:text-gray-800'}`}>
            Categories
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;