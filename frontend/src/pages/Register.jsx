import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, School, BookOpen, GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: 'University of Ruhuna',
    department: 'Computer Engineering',
    year: 3,
    semester: 1
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Demo Fallback
      if (formData.name && formData.email) {
        localStorage.setItem('token', 'demo-jwt-token-12345');
        localStorage.setItem('user', JSON.stringify(formData));
        navigate('/dashboard');
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex w-full transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19]' : 'bg-[#F8FAFC]'}`}>
      
      {/* LEFT SIDE: Visual Feature Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <GraduationCap className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">EduMetrics</h2>
            <p className="text-xs text-indigo-200">Academic Analytics & GPA Management</p>
          </div>
        </div>

        {/* Middle Showcase Content */}
        <div className="relative z-10 max-w-md space-y-6 my-auto">
          <div className="space-y-3">
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Fast & Secure Student Onboarding</span>
            </span>
            <h1 className="text-3xl font-extrabold leading-tight text-white">
              Join EduMetrics Today
            </h1>
            <p className="text-xs text-indigo-100/80 leading-relaxed">
              Create your account in seconds to start tracking your semester modules, credits, and cumulative GPA with intelligent academic insights.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-medium">Automated GPA Calculation</strong>
                <span className="text-indigo-200/70">No more manual spreadsheets. Get instant grade point calculations.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-medium">Personalized Profile & Academic Records</strong>
                <span className="text-indigo-200/70">Easily manage your university, department, and semester progress.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-indigo-200/60">
          © {new Date().getFullYear()} EduMetrics. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 my-auto">
        <div className={`w-full max-w-lg p-8 rounded-3xl border shadow-xl transition-all ${darkMode ? 'bg-[#111827] border-[#1F293D] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Create an Account</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your details to register as a student.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs bg-rose-500/10 border border-rose-500/30 text-rose-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Tharushika Dilrukshi"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@ruh.ac.lk"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">University</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Department</label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Academic Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition mt-2"
            >
              <UserPlus size={16} />
              <span>{loading ? 'Registering...' : 'Register Account'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}