import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, Calculator, Award, Bell, Settings, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/courses', icon: BookOpen },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'GPA Calculator', path: '/calculator', icon: Calculator },
    { name: 'Achievements', path: '/achievements', icon: Award },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#0B132B] border-r border-slate-800/80 min-h-screen flex flex-col justify-between p-4 sticky top-0">
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6">
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md">
            <BookOpen size={22} />
          </div>
          <span className="text-lg font-bold text-white tracking-wide">EduMetrics</span>
        </div>

        {/* Menu Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-950/40 transition text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}