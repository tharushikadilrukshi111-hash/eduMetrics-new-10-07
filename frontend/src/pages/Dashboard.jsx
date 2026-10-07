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

  //greeting based on time of day
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
    <div className="min-h-screen bg-[#070F22] text-slate-100 flex">
      {/* Left Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-[#0B132B]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-bold text-white">
                 {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-xs text-slate-400">Here's your academic journey at a glance.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 bg-[#131E3A] border border-slate-700/60 text-slate-200 px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition shadow-sm text-sm"
            >
              <User size={15} />
              <span className="font-medium">{user?.name || 'Student'}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Stats Row - Compact & Balanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0B132B] border border-slate-800/80 p-5 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Cumulative GPA</p>
                <h3 className="text-2xl font-extrabold text-blue-400 mt-0.5">{calculateGPA()}</h3>
              </div>
              <div className="bg-blue-950/60 border border-blue-800/40 p-3 rounded-xl text-blue-400">
                <Award size={24} />
              </div>
            </div>

            <div className="bg-[#0B132B] border border-slate-800/80 p-5 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Total Courses Enrolled</p>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{courses.length}</h3>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-emerald-400">
                <BookOpen size={24} />
              </div>
            </div>

            <div className="bg-[#0B132B] border border-slate-800/80 p-5 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Academic Year / Sem</p>
                <h3 className="text-base font-bold text-white mt-0.5">Year {user?.year} - Sem {user?.semester}</h3>
              </div>
              <div className="bg-purple-950/60 border border-purple-800/40 p-3 rounded-xl text-purple-400">
                <User size={24} />
              </div>
            </div>
          </div>

          {/* Analytics Chart Section */}
          {courses.length > 0 && (
            <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-5">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart2 className="text-blue-400" size={18} />
                <h3 className="text-base font-bold text-white">Course Grade Points Analytics</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#131E3A" />
                    <XAxis dataKey="code" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 4]} stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="gradePoint" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Courses Section */}
          <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Enrolled Courses & Grades</h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-xl shadow-md transition text-xs"
              >
                <PlusCircle size={15} />
                <span>Add Course</span>
              </button>
            </div>

            {courses.length === 0 ? (
              <p className="text-slate-400 text-center py-6 text-sm">No courses added yet. Click 'Add Course' to start tracking your GPA.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs">
                      <th className="py-2.5 px-3">Course Code</th>
                      <th className="py-2.5 px-3">Course Name</th>
                      <th className="py-2.5 px-3">Credits</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 text-slate-300">
                        <td className="py-3 px-3 font-semibold text-white">{course.code}</td>
                        <td className="py-3 px-3">{course.name}</td>
                        <td className="py-3 px-3">{course.credits}</td>
                        <td className="py-3 px-3 font-bold text-blue-400">{course.grade}</td>
                        <td className="py-3 px-3">
                          <span className="bg-[#131E3A] border border-slate-700/60 text-slate-300 text-[11px] px-2 py-0.5 rounded-full font-medium">{course.category}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-400 hover:text-red-300 p-1 transition"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="bg-[#0B132B] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Course</h3>
            {error && <div className="mb-4 bg-red-950/80 border border-red-700/50 text-red-300 p-3 rounded-xl text-xs">{error}</div>}
            
            <form onSubmit={handleAddCourse} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="EE3101"
                    className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Control Systems"
                    className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Credits</label>
                  <input
                    type="number"
                    name="credits"
                    required
                    min={1}
                    max={6}
                    value={formData.credits}
                    onChange={handleChange}
                    className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="A+" className="bg-[#0B132B]">A+</option>
                    <option value="A" className="bg-[#0B132B]">A</option>
                    <option value="A-" className="bg-[#0B132B]">A-</option>
                    <option value="B+" className="bg-[#0B132B]">B+</option>
                    <option value="B" className="bg-[#0B132B]">B</option>
                    <option value="B-" className="bg-[#0B132B]">B-</option>
                    <option value="C+" className="bg-[#0B132B]">C+</option>
                    <option value="C" className="bg-[#0B132B]">C</option>
                    <option value="C-" className="bg-[#0B132B]">C-</option>
                    <option value="E" className="bg-[#0B132B]">E</option>
                    <option value="F" className="bg-[#0B132B]">F</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Core" className="bg-[#0B132B]">Core</option>
                    <option value="Technical Electives" className="bg-[#0B132B]">Technical Electives</option>
                    <option value="General" className="bg-[#0B132B]">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full bg-[#070F22] border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value={1} className="bg-[#0B132B]">Semester 1</option>
                    <option value={2} className="bg-[#0B132B]">Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition shadow-md text-xs"
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