import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Building, BookOpen, Calendar } from 'lucide-react';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F7FC] px-4 py-8 text-[#173B63]">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-[#5B8DEF]/20">
        <h2 className="mb-2 text-center text-3xl font-extrabold text-[#173B63]">Create Account</h2>
        <p className="mb-6 text-center text-xs text-slate-500">Join EduMetrics to track your academic journey</p>

        {error && <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="R. Tharushika Dilrukshi"
              className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 px-3 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@eng.ruh.ac.lk"
              className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 px-3 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 px-3 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 px-3 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
              >
                <option value={1} className="bg-white">Year 1</option>
                <option value={2} className="bg-white">Year 2</option>
                <option value={3} className="bg-white">Year 3</option>
                <option value={4} className="bg-white">Year 4</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#5B8DEF]/30 bg-[#F2F7FC] py-2.5 px-3 text-xs text-[#173B63] focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
              >
                <option value={1} className="bg-white">Semester 1</option>
                <option value={2} className="bg-white">Semester 2</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#5B8DEF] py-2.5 text-xs font-semibold text-white transition duration-200 hover:bg-[#4975d1] shadow-sm mt-2"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#5B8DEF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}