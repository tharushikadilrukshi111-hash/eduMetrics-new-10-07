import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, Download, Trash2, CheckCircle2, User, Moon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { darkMode, setDarkMode } = useTheme(); // Connected with ThemeContext
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
    <div className="min-h-screen bg-[#F2F7FC] text-[#173B63] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#5B8DEF]/20 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#173B63]">Platform Settings</h1>
            <p className="text-xs text-slate-500">Manage your appearance, notifications, and data preferences.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 bg-[#F2F7FC] border border-[#5B8DEF]/30 text-[#173B63] px-3.5 py-1.5 rounded-xl hover:bg-slate-100 transition shadow-sm text-sm font-medium"
            >
              <User size={15} />
              <span>{user?.name || 'Student'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">

          {successMsg && (
            <div className="bg-[#48B8A6]/10 border border-[#48B8A6]/30 text-[#48B8A6] text-xs p-3.5 rounded-xl flex items-center space-x-2 font-medium">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Appearance & Theme Settings */}
            <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 p-2.5 rounded-xl text-[#5B8DEF]">
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B63]">Appearance & Theme</h3>
                  <p className="text-xs text-slate-500">Professional SaaS Light Theme is currently active.</p>
                </div>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between bg-[#F2F7FC] border border-[#5B8DEF]/20 p-4 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-[#173B63]">SaaS Clean Palette Mode</h4>
                    <p className="text-[11px] text-slate-500">Enable soft blue background with navy highlights.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="w-4 h-4 accent-[#5B8DEF] cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-[#F5B860]/10 border border-[#F5B860]/30 p-2.5 rounded-xl text-[#d99f48]">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B63]">Notification Preferences</h3>
                  <p className="text-xs text-slate-500">Control what automated alerts you receive.</p>
                </div>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between bg-[#F2F7FC] border border-[#5B8DEF]/20 p-4 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-[#173B63]">Email Notifications</h4>
                    <p className="text-[11px] text-slate-500">Receive academic summaries and important notices via email.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts} 
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#5B8DEF] cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between bg-[#F2F7FC] border border-[#5B8DEF]/20 p-4 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-[#173B63]">Auto-Calculated Academic Alerts</h4>
                    <p className="text-[11px] text-slate-500">Get automatic GPA warnings & achievement notifications.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoAlerts} 
                    onChange={(e) => setAutoAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#5B8DEF] cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Data & Records Management */}
            <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-[#48B8A6]/10 border border-[#48B8A6]/30 p-2.5 rounded-xl text-[#48B8A6]">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B63]">Data & Records Management</h3>
                  <p className="text-xs text-slate-500">Export or clear your local tracking information.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex items-center space-x-2 bg-[#F2F7FC] border border-[#5B8DEF]/30 text-[#173B63] px-4 py-2 rounded-xl hover:bg-slate-100 transition text-xs font-medium"
                >
                  <Download size={15} />
                  <span>Export Course Data</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearRecords}
                  className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2 rounded-xl hover:bg-rose-100 transition text-xs font-medium"
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
                className="bg-[#5B8DEF] hover:bg-[#4975d1] text-white font-medium px-6 py-2.5 rounded-xl transition text-xs shadow-sm"
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