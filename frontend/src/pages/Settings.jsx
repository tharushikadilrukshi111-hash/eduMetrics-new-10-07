import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, Download, Trash2, CheckCircle2, User, Moon } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Fixed Dark Mode toggle (always active SaaS theme)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate, token]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg('Platform settings updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleExportData = () => {
    alert('Exporting your academic records and course logs as JSON...');
  };

  const handleClearRecords = () => {
    if (window.confirm('Are you sure you want to clear your local cache records?')) {
      alert('Cache cleared successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070F22] text-slate-100 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-[#0B132B]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-bold text-white">Platform Settings</h1>
            <p className="text-xs text-slate-400">Manage your appearance, notifications, and data preferences.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 bg-[#131E3A] border border-slate-700/60 text-slate-200 px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition shadow-sm text-sm"
            >
              <User size={15} />
              <span className="font-medium">{user?.name || 'Student'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">

          {successMsg && (
            <div className="bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center space-x-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Appearance & Dark Mode Settings */}
            <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-blue-950/60 border border-blue-800/40 p-2.5 rounded-xl text-blue-400">
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Appearance & Theme</h3>
                  <p className="text-xs text-slate-400">Professional SaaS Dark Mode is permanently enabled.</p>
                </div>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between bg-[#070F22] border border-slate-800 p-4 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-white">Dark Mode (EduMetrics SaaS Theme)</h4>
                    <p className="text-[11px] text-slate-400">Always-on professional dark blue & indigo theme.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-amber-950/60 border border-amber-800/40 p-2.5 rounded-xl text-amber-400">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Notification Preferences</h3>
                  <p className="text-xs text-slate-400">Control what automated alerts you receive.</p>
                </div>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between bg-[#070F22] border border-slate-800 p-4 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-white">Email Notifications</h4>
                    <p className="text-[11px] text-slate-400">Receive academic summaries and important notices via email.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts} 
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between bg-[#070F22] border border-slate-800 p-4 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-white">Auto-Calculated Academic Alerts</h4>
                    <p className="text-[11px] text-slate-400">Get automatic GPA warnings & achievement notifications.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoAlerts} 
                    onChange={(e) => setAutoAlerts(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Data & Records Management */}
            <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-emerald-950/60 border border-emerald-800/40 p-2.5 rounded-xl text-emerald-400">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Data & Records Management</h3>
                  <p className="text-xs text-slate-400">Export or clear your local tracking information.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex items-center space-x-2 bg-[#131E3A] border border-slate-700/60 text-slate-200 px-4 py-2 rounded-xl hover:bg-slate-800 transition text-xs font-medium"
                >
                  <Download size={15} />
                  <span>Export Course Data</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearRecords}
                  className="flex items-center space-x-2 bg-red-950/40 border border-red-800/40 text-red-400 px-4 py-2 rounded-xl hover:bg-red-900/40 transition text-xs font-medium"
                >
                  <Trash2 size={15} />
                  <span>Clear Cache Records</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl transition text-xs shadow-md"
              >
                Save Changes
              </button>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
}