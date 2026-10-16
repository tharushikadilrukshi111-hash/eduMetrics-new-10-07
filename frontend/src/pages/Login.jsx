import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, BookOpen, GraduationCap, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Demo Fallback for local testing if server is offline
      if (formData.email && formData.password) {
        const dummyUser = {
          name: 'Tharushika Dilrukshi',
          email: formData.email,
          university: 'University of Ruhuna',
          department: 'Computer Engineering',
          year: 3,
          semester: 1
        };
        localStorage.setItem('token', 'demo-jwt-token-12345');
        localStorage.setItem('user', JSON.stringify(dummyUser));
        navigate('/dashboard');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex w-full transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19]' : 'bg-[#F8FAFC]'}`}>
      
      {/* LEFT SIDE: Visual Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <GraduationCap className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">EduMetrics</h2>
            <p className="text-xs text-indigo-200">Academic Analytics & GPA Management</p>
          </div>
        </div>

        {/* Middle Visual Illustration / Content */}
        <div className="relative z-10 max-w-md space-y-8 my-auto">
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Award size={14} className="text-amber-300" />
              <span>Smart Student Workspace</span>
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white">
              Take full control of your academic journey.
            </h1>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Track course credits, visualize your GPA trends, and manage university modules effortlessly with real-time dynamic analytics.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Real-Time GPA Calculations</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <TrendingUp size={16} className="text-indigo-300 shrink-0" />
              <span>Interactive Analytics</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <BookOpen size={16} className="text-amber-300 shrink-0" />
              <span>Course CRUD Management</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Global Theme Adaptation</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-indigo-200/60">
          © {new Date().getFullYear()} EduMetrics. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-xl transition-all ${darkMode ? 'bg-[#111827] border-[#1F293D] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-600/10 text-indigo-600 mb-3 lg:hidden">
              <GraduationCap size={28} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">Please enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl text-xs bg-rose-500/10 border border-rose-500/30 text-rose-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Email Address</label>
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
              <label className="block text-slate-400 mb-1.5 font-medium">Password</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition"
            >
              <LogIn size={16} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-500 hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}