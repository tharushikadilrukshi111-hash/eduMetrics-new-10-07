import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Award, PlusCircle, Trash2, User, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    grade: 'A',
    semester: 1,
    year: 3,
    category: 'Core'
  });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ name: '', code: '', credits: 3, grade: 'A', semester: 1, year: 3, category: 'Core' });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add course');
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course', err);
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

  // Prepare chart data
  const chartData = courses.map(c => ({
    code: c.code,
    gradePoint: c.gradePoint,
    credits: c.credits
  }));

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F7FC] text-[#173B63] flex">
      {/* Left Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#5B8DEF]/20 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#173B63]">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-xs text-slate-500">Here's your academic journey at a glance.</p>
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

        {/* Dashboard Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Stats Row - Compact & Balanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Cumulative GPA</p>
                <h3 className="text-2xl font-extrabold text-[#5B8DEF] mt-0.5">{calculateGPA()}</h3>
              </div>
              <div className="bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 p-3 rounded-xl text-[#5B8DEF]">
                <Award size={24} />
              </div>
            </div>

            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Courses Enrolled</p>
                <h3 className="text-2xl font-extrabold text-[#173B63] mt-0.5">{courses.length}</h3>
              </div>
              <div className="bg-[#48B8A6]/10 border border-[#48B8A6]/30 p-3 rounded-xl text-[#48B8A6]">
                <BookOpen size={24} />
              </div>
            </div>

            <div className="bg-white border border-[#5B8DEF]/20 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Academic Year / Sem</p>
                <h3 className="text-base font-bold text-[#173B63] mt-0.5">Year {user?.year || 3} Sem {user?.semester || 1}</h3>
              </div>
              <div className="bg-[#AFA8E8]/20 border border-[#AFA8E8]/40 p-3 rounded-xl text-[#7c72d6]">
                <User size={24} />
              </div>
            </div>
          </div>

          {/* Analytics Chart Section */}
          {courses.length > 0 && (
            <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-5">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart2 className="text-[#5B8DEF]" size={18} />
                <h3 className="text-base font-bold text-[#173B63]">Course Grade Points Analytics</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F7FC" />
                    <XAxis dataKey="code" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 4]} stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#5B8DEF33', borderRadius: '0.75rem', color: '#173B63', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="gradePoint" fill="#5B8DEF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Courses Section */}
          <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[#173B63]">Enrolled Courses & Grades</h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-1.5 bg-[#5B8DEF] hover:bg-[#4975d1] text-white font-medium px-3.5 py-2 rounded-xl shadow-sm transition text-xs"
              >
                <PlusCircle size={15} />
                <span>Add Course</span>
              </button>
            </div>

            {courses.length === 0 ? (
              <p className="text-slate-500 text-center py-6 text-sm">No courses added yet. Click 'Add Course' to start tracking your GPA.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#5B8DEF]/20 text-slate-500 text-xs">
                      <th className="py-2.5 px-3 font-semibold">Course Code</th>
                      <th className="py-2.5 px-3 font-semibold">Course Name</th>
                      <th className="py-2.5 px-3 font-semibold">Credits</th>
                      <th className="py-2.5 px-3 font-semibold">Grade</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id} className="border-b border-[#5B8DEF]/10 hover:bg-[#F2F7FC]/60 text-[#173B63]">
                        <td className="py-3 px-3 font-semibold text-[#173B63]">{course.code}</td>
                        <td className="py-3 px-3 text-slate-700">{course.name}</td>
                        <td className="py-3 px-3 text-slate-700">{course.credits}</td>
                        <td className="py-3 px-3 font-bold text-[#5B8DEF]">{course.grade}</td>
                        <td className="py-3 px-3">
                          <span className="bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 text-[#5B8DEF] text-[11px] px-2.5 py-0.5 rounded-full font-medium">{course.category}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#173B63]/40 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="bg-white border border-[#5B8DEF]/30 w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#173B63] mb-4">Add New Course</h3>
            {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs">{error}</div>}
            
            <form onSubmit={handleAddCourse} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="EE3101"
                    className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-xl p-2 text-[#173B63] focus:outline-none focus:border-[#5B8DEF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Control Systems"
                    className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-xl p-2 text-[#173B63] focus:outline-none focus:border-[#5B8DEF] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Credits</label>
                  <input
                    type="number"
                    name="credits"
                    required
                    min={1}
                    max={6}
                    value={formData.credits}
                    onChange={handleChange}
                    className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-xl p-2 text-[#173B63] focus:outline-none focus:border-[#5B8DEF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-xl p-2 text-[#173B63] font-bold focus:outline-none focus:border-[#5B8DEF] text-xs"
                  >
                    <option value="A+" className="bg-white">A+</option>
                    <option value="A" className="bg-white">A</option>
                    <option value="A-" className="bg-white">A-</option>
                    <option value="B+" className="bg-white">B+</option>
                    <option value="B" className="bg-white">B</option>
                    <option value="B-" className="bg-white">B-</option>
                    <option value="C+" className="bg-white">C+</option>
                    <option value="C" className="bg-white">C</option>
                    <option value="C-" className="bg-white">C-</option>
                    <option value="E" className="bg-white">E</option>
                    <option value="F" className="bg-white">F</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-xl p-2 text-[#173B63] focus:outline-none focus:border-[#5B8DEF] text-xs"
                  >
                    <option value="Core" className="bg-white">Core</option>
                    <option value="Technical Electives" className="bg-white">Technical Electives</option>
                    <option value="General" className="bg-white">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-xl p-2 text-[#173B63] focus:outline-none focus:border-[#5B8DEF] text-xs"
                  >
                    <option value={1} className="bg-white">Semester 1</option>
                    <option value={2} className="bg-white">Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 transition text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B8DEF] text-white font-medium rounded-xl hover:bg-[#4975d1] transition shadow-sm text-xs"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}