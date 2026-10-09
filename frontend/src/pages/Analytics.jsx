import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart2, Award, BookOpen, CheckCircle, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';

export default function Analytics() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
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

  // Calculate Cumulative GPA
  const calculateGPA = () => {
    if (courses.length === 0) return '0.00';
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((c) => {
      totalPoints += c.gradePoint * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
  };

  const totalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);

  const chartData = courses.map(c => ({
    code: c.code,
    gradePoint: c.gradePoint,
    name: c.name
  }));

  return (
    <div className="min-h-screen bg-[#F2F7FC] text-[#173B63] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#5B8DEF]/20 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#173B63]">Academic Analytics</h1>
            <p className="text-xs text-slate-500">Visualize your performance and progress.</p>
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
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm">
              <p className="text-xs font-medium text-slate-500">Overall GPA</p>
              <h3 className="text-2xl font-extrabold text-[#5B8DEF] mt-1">{calculateGPA()}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Target: 3.80</p>
            </div>

            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm">
              <p className="text-xs font-medium text-slate-500">Total Courses</p>
              <h3 className="text-2xl font-extrabold text-[#173B63] mt-1">{courses.length}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Active semester</p>
            </div>

            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm">
              <p className="text-xs font-medium text-slate-500">Total Credits</p>
              <h3 className="text-2xl font-extrabold text-[#48B8A6] mt-1">{totalCredits} / 150</h3>
              <p className="text-[11px] text-slate-400 mt-1">Degree progress</p>
            </div>

            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm">
              <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
              <h3 className="text-2xl font-extrabold text-[#AFA8E8] mt-1">94%</h3>
              <p className="text-[11px] text-slate-400 mt-1">Excellent standing</p>
            </div>
          </div>

          {/* Bar Chart Analytics Section */}
          <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart2 className="text-[#5B8DEF]" size={20} />
              <h3 className="text-base font-bold text-[#173B63]">Subject Performance Breakdown</h3>
            </div>

            {courses.length === 0 ? (
              <p className="text-slate-400 text-center py-10 text-sm">No courses recorded yet. Add courses to view analytics.</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F7FC" />
                    <XAxis dataKey="code" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 4]} stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#5B8DEF33', borderRadius: '0.75rem', color: '#173B63', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="gradePoint" fill="#5B8DEF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}