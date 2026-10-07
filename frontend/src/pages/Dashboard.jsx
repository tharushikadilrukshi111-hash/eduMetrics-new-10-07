import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Award, LogOut, PlusCircle, Trash2, User, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950 text-slate-100">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-cyan-900/50 px-8 py-4 flex justify-between items-center sticky top-0 z-40 w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-cyan-900/40">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">EduMetrics</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Profile Settings Button */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 bg-slate-800/80 border border-cyan-900/60 text-cyan-300 px-4 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition shadow-md"
          >
            <User size={18} />
            <span className="font-medium">{user?.name || 'Student'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-950/60 border border-red-900/50 text-red-300 px-3 py-2 rounded-xl hover:bg-red-900/80 transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content (Full Width) */}
      <div className="w-full px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/80 border border-cyan-900/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400">Cumulative GPA</p>
              <h3 className="text-3xl font-extrabold text-cyan-300 mt-1">{calculateGPA()}</h3>
            </div>
            <div className="bg-cyan-950/80 border border-cyan-800/50 p-4 rounded-2xl text-cyan-400 shadow-inner">
              <Award size={32} />
            </div>
          </div>
          <div className="bg-slate-900/80 border border-cyan-900/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400">Total Courses Enrolled</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{courses.length}</h3>
            </div>
            <div className="bg-blue-950/80 border border-blue-800/50 p-4 rounded-2xl text-blue-400 shadow-inner">
              <BookOpen size={32} />
            </div>
          </div>
          <div className="bg-slate-900/80 border border-cyan-900/50 p-6 rounded-3xl shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400">Academic Year / Sem</p>
              <h3 className="text-xl font-bold text-white mt-1">Year {user?.year} - Sem {user?.semester}</h3>
            </div>
            <div className="bg-purple-950/80 border border-purple-800/50 p-4 rounded-2xl text-purple-400 shadow-inner">
              <User size={32} />
            </div>
          </div>
        </div>

        {/* Analytics Chart Section */}
        {courses.length > 0 && (
          <div className="bg-slate-900/80 border border-cyan-900/50 rounded-3xl shadow-xl backdrop-blur-xl p-6 mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart2 className="text-cyan-400" size={22} />
              <h3 className="text-xl font-bold text-white">Course Grade Points Analytics</h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="code" stroke="#94a3b8" />
                  <YAxis domain={[0, 4]} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }} />
                  <Bar dataKey="gradePoint" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Courses Section */}
        <div className="bg-slate-900/80 border border-cyan-900/50 rounded-3xl shadow-xl backdrop-blur-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Enrolled Courses & Grades</h3>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition"
            >
              <PlusCircle size={18} />
              <span>Add Course</span>
            </button>
          </div>

          {courses.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No courses added yet. Click 'Add Course' to start tracking your GPA.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-cyan-400 text-sm">
                    <th className="py-3 px-4">Course Code</th>
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b border-slate-800/60 hover:bg-slate-800/40 text-slate-300">
                      <td className="py-3 px-4 font-semibold text-cyan-300">{course.code}</td>
                      <td className="py-3 px-4">{course.name}</td>
                      <td className="py-3 px-4">{course.credits}</td>
                      <td className="py-3 px-4 font-bold text-cyan-400">{course.grade}</td>
                      <td className="py-3 px-4">
                        <span className="bg-cyan-950 border border-cyan-800/60 text-cyan-300 text-xs px-2.5 py-1 rounded-full font-medium">{course.category}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-400 hover:text-red-300 p-1 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="bg-slate-900 border border-cyan-900/60 w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Add New Course</h3>
            {error && <div className="mb-4 bg-red-950/80 border border-red-700/50 text-red-300 p-3 rounded-xl text-sm">{error}</div>}
            
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="EE3101"
                    className="w-full bg-slate-950 border border-cyan-900/60 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Control Systems"
                    className="w-full bg-slate-950 border border-cyan-900/60 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">Credits</label>
                  <input
                    type="number"
                    name="credits"
                    required
                    min={1}
                    max={6}
                    value={formData.credits}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-cyan-900/60 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-cyan-900/60 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="A+" className="bg-slate-900">A+</option>
                    <option value="A" className="bg-slate-900">A</option>
                    <option value="A-" className="bg-slate-900">A-</option>
                    <option value="B+" className="bg-slate-900">B+</option>
                    <option value="B" className="bg-slate-900">B</option>
                    <option value="B-" className="bg-slate-900">B-</option>
                    <option value="C+" className="bg-slate-900">C+</option>
                    <option value="C" className="bg-slate-900">C</option>
                    <option value="C-" className="bg-slate-900">C-</option>
                    <option value="E" className="bg-slate-900">E</option>
                    <option value="F" className="bg-slate-900">F</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-cyan-900/60 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Core" className="bg-slate-900">Core</option>
                    <option value="Technical Electives" className="bg-slate-900">Technical Electives</option>
                    <option value="General" className="bg-slate-900">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-cyan-900/60 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value={1} className="bg-slate-900">Semester 1</option>
                    <option value={2} className="bg-slate-900">Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition shadow-lg"
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