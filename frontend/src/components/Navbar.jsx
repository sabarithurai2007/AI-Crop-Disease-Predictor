import React from 'react';
import { Sprout, LogOut, User, LayoutDashboard, History, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab, onOpenAuthModal }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-primary-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:bg-primary-700 transition-colors shadow-sm">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-primary-900 flex items-center">
              AgriGuard<span className="text-primary-600 font-semibold">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-primary-100 text-primary-900 shadow-2xs'
                  : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
              }`}
            >
              Home
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => setActiveTab('predictor')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-1.5 ${
                    activeTab === 'predictor'
                      ? 'bg-primary-100 text-primary-900 shadow-2xs'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                >
                  <Leaf className="h-4 w-4" />
                  <span>Diagnosis</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-1.5 ${
                    activeTab === 'history'
                      ? 'bg-primary-100 text-primary-900 shadow-2xs'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-primary-100 text-primary-900 shadow-2xs'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              </>
            )}
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-2 bg-primary-50/50 border border-primary-100/50 px-3 py-1.5 rounded-full">
                  <div className="bg-primary-200 p-1 rounded-full text-primary-800">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-primary-900">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
