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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-8 w-full">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Student Profile Settings
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-md">
              <User size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user.name || 'Student Name'}</h2>
              <p className="text-sm text-blue-600 flex items-center mt-1 font-medium">
                <Shield size={14} className="mr-1" /> Verified Student Account
              </p>
            </div>
          </div>

          {message && <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-sm font-medium">{message}</div>}
          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <User size={16} className="mr-2 text-blue-600" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Email (Disabled/Readonly) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Mail size={16} className="mr-2 text-blue-600" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Building size={16} className="mr-2 text-blue-600" /> University
                </label>
                <input
                  type="text"
                  name="university"
                  value={user.university}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <BookOpen size={16} className="mr-2 text-blue-600" /> Department / Faculty
                </label>
                <input
                  type="text"
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-600" /> Academic Year
                </label>
                <select
                  name="year"
                  value={user.year}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-600" /> Semester
                </label>
                <select
                  name="semester"
                  value={user.semester}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
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