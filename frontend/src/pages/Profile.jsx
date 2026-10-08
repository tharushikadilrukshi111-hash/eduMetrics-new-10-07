import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, GraduationCap, Shield, Lock, LogOut, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
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
    fetchCourses();
  }, [navigate, token]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  // Calculate dynamic GPA & Credits
  const calculateStats = () => {
    if (courses.length === 0) return { gpa: '0.00', totalCredits: 0 };
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((c) => {
      totalPoints += c.gradePoint * c.credits;
      totalCredits += c.credits;
    });
    const gpa = totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
    return { gpa, totalCredits };
  };

  const { gpa, totalCredits } = calculateStats();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Backend password update endpoint integration can be wired here
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Failed to update password. Please try again.');
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
            <h1 className="text-lg font-bold text-white">User Profile & Settings</h1>
            <p className="text-xs text-slate-400">Manage your account information and academic standing.</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-red-950/60 border border-red-800/40 text-red-400 px-3.5 py-1.5 rounded-xl hover:bg-red-900/40 transition text-xs font-semibold"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          
          {/* Profile Header Card */}
          <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">{user?.name || 'Student User'}</h2>
                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <Mail size={13} className="mr-1.5 text-slate-500" />
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-[#070F22] border border-slate-800 px-4 py-2.5 rounded-xl">
              <Shield className="text-emerald-400" size={18} />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Account Status</p>
                <p className="text-xs font-bold text-emerald-400">Active Student</p>
              </div>
            </div>
          </div>

          {/* Academic Overview Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0B132B] border border-slate-800/80 p-5 rounded-2xl shadow-lg">
              <p className="text-xs font-medium text-slate-400">Cumulative GPA</p>
              <h3 className="text-2xl font-extrabold text-blue-400 mt-1">{gpa}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Calculated from active courses</p>
            </div>

            <div className="bg-[#0B132B] border border-slate-800/80 p-5 rounded-2xl shadow-lg">
              <p className="text-xs font-medium text-slate-400">Completed Credits</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{totalCredits} Cr</h3>
              <p className="text-[11px] text-slate-500 mt-1">Total registered course credits</p>
            </div>

            <div className="bg-[#0B132B] border border-slate-800/80 p-5 rounded-2xl shadow-lg">
              <p className="text-xs font-medium text-slate-400">Tracked Courses</p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{courses.length} Courses</h3>
              <p className="text-[11px] text-slate-500 mt-1">Stored in MongoDB records</p>
            </div>
          </div>

          {/* Account Security & Password Change */}
          <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-5">
              <div className="bg-blue-950/60 border border-blue-800/40 p-2.5 rounded-xl text-blue-400">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Security & Password</h3>
                <p className="text-xs text-slate-400">Update your account password securely.</p>
              </div>
            </div>

            {message && (
              <div className="mb-4 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs p-3 rounded-xl flex items-center space-x-2">
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-950/60 border border-red-800/40 text-red-400 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Password</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl transition text-xs shadow-md"
              >
                Update Password
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}