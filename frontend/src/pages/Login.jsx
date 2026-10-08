import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F7FC] px-4 text-[#173B63]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-[#5B8DEF]/20">
        <h2 className="mb-2 text-center text-3xl font-extrabold text-[#173B63]">EduMetrics</h2>
        <p className="mb-8 text-center text-sm text-slate-500">Sign in to your academic analytics dashboard</p>
        
        {error && <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.ac.lk"
                className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 pl-10 pr-4 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 pl-10 pr-4 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#5B8DEF] py-2.5 text-xs font-semibold text-white transition duration-200 hover:bg-[#4975d1] shadow-sm"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[#5B8DEF] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}