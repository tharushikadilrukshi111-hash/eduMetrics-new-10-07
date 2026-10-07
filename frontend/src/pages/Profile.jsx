import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, ArrowLeft, Save, Shield, Mail, Building, BookOpen, Calendar } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    university: '',
    department: '',
    year: 3,
    semester: 1
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950 text-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-cyan-300 hover:text-white bg-cyan-950/50 border border-cyan-800/60 px-4 py-2 rounded-xl transition shadow-lg backdrop-blur-md"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
            Student Profile Settings
          </h1>
        </div>

        {/* Profile Card with Ocean Theme */}
        <div className="bg-slate-900/80 border border-cyan-900/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Decorative glowing gradient effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-800">
            <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-cyan-900/40">
              <User size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name || 'Student Name'}</h2>
              <p className="text-sm text-cyan-400 flex items-center mt-1">
                <Shield size={14} className="mr-1" /> Verified Student Account
              </p>
            </div>
          </div>

          {message && <div className="mb-6 bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 p-3.5 rounded-xl text-sm font-medium">{message}</div>}
          {error && <div className="mb-6 bg-red-950/80 border border-red-700/50 text-red-300 p-3.5 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center">
                  <User size={16} className="mr-2 text-cyan-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/60 border border-cyan-900/60 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              {/* Email (Disabled/Readonly) */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center">
                  <Mail size={16} className="mr-2 text-cyan-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-950/30 border border-slate-800 rounded-xl p-3 text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center">
                  <Building size={16} className="mr-2 text-cyan-400" /> University
                </label>
                <input
                  type="text"
                  name="university"
                  value={user.university}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-cyan-900/60 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center">
                  <BookOpen size={16} className="mr-2 text-cyan-400" /> Department / Faculty
                </label>
                <input
                  type="text"
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-cyan-900/60 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-cyan-400" /> Academic Year
                </label>
                <select
                  name="year"
                  value={user.year}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-cyan-900/60 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                >
                  <option value={1} className="bg-slate-900">Year 1</option>
                  <option value={2} className="bg-slate-900">Year 2</option>
                  <option value={3} className="bg-slate-900">Year 3</option>
                  <option value={4} className="bg-slate-900">Year 4</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-cyan-400" /> Semester
                </label>
                <select
                  name="semester"
                  value={user.semester}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-cyan-900/60 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                >
                  <option value={1} className="bg-slate-900">Semester 1</option>
                  <option value={2} className="bg-slate-900">Semester 2</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-cyan-600/30 transition transform hover:-translate-y-0.5"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}