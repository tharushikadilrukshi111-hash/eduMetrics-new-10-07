import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, PlusCircle, Trash2, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
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

  return (
    <div className="min-h-screen bg-[#070F22] text-slate-100 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-[#0B132B]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-bold text-white">My Courses</h1>
            <p className="text-xs text-slate-400">Manage your subjects and track your progress.</p>
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

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">All Enrolled Courses</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total courses: {courses.length}</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl shadow-md transition text-xs"
              >
                <PlusCircle size={16} />
                <span>Add Course</span>
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-slate-600 mb-3" size={40} />
                <p className="text-slate-400 text-sm">No courses found. Click 'Add Course' to begin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div key={course._id} className="bg-[#070F22] border border-slate-800 p-5 rounded-xl shadow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/50">
                          {course.code}
                        </span>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-slate-500 hover:text-red-400 transition p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">{course.name}</h4>
                      <p className="text-xs text-slate-400">Category: {course.category}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400">Credits: <strong className="text-slate-200">{course.credits}</strong></span>
                      <span className="text-slate-400">Grade: <strong className="text-blue-400 font-bold">{course.grade}</strong></span>
                    </div>
                  </div>
                ))}
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