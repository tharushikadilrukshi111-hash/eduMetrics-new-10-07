import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, PlusCircle, Trash2, Edit2, User, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  
  // Default course form data with Year and Semester
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    grade: 'A',
    year: 3,
    semester: 1,
    category: 'Core'
  });
  
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
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

  const handleOpenAddModal = () => {
    setEditingCourseId(null);
    setFormData({
      name: '',
      code: '',
      credits: 3,
      grade: 'A',
      year: user?.year || 3,
      semester: user?.semester || 1,
      category: 'Core'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits,
      grade: course.grade,
      year: Number(course.year) || 3,
      semester: Number(course.semester) || 1,
      category: course.category || 'Core'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        // UPDATE (PUT) Course
        await axios.put(`http://localhost:5000/api/courses/${editingCourseId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // CREATE (POST) Course
        await axios.post('http://localhost:5000/api/courses', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      // Local fallback in case backend API route isn't configured
      if (editingCourseId) {
        setCourses(courses.map(c => c._id === editingCourseId ? { ...c, ...formData } : c));
      } else {
        setCourses([...courses, { ...formData, _id: Date.now().toString() }]);
      }
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCourses();
      } catch (err) {
        setCourses(courses.filter(c => c._id !== id));
      }
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-[#111827]/90 border-[#1F293D]' : 'bg-white/90 border-slate-200'} backdrop-blur-xl border-b px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
          <div>
            <h1 className="text-lg font-bold">My Courses</h1>
            <p className="text-xs text-slate-400">Manage, edit, and categorize all your enrolled subjects.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center space-x-2 border px-3.5 py-1.5 rounded-xl transition shadow-sm text-xs font-medium ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-slate-200' : 'bg-[#F8FAFC] border-slate-200 text-slate-700'}`}
            >
              <User size={15} />
              <span>{user?.name || 'Tharushika Dilrukshi'}</span>
            </button>
          </div>
        </header>

        {/* Content Card */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className={`${darkMode ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'} rounded-2xl shadow-sm p-6 border transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">Enrolled Courses</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total courses registered: {courses.length}</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition text-xs"
              >
                <PlusCircle size={16} />
                <span>Add Course</span>
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-slate-500 mb-3" size={40} />
                <p className="text-slate-400 text-sm">No courses found. Click 'Add Course' to begin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div key={course._id} className={`${darkMode ? 'bg-[#151D2A] border-[#2D3748]' : 'bg-[#F8FAFC] border-slate-200'} p-5 rounded-xl border shadow-sm flex flex-col justify-between space-y-4 transition-colors`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                          {course.code}
                        </span>

                        {/* Actions (Edit & Delete) */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(course)}
                            className="p-1.5 text-slate-400 hover:text-indigo-500 transition rounded-lg hover:bg-slate-700/30"
                            title="Edit Course"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition rounded-lg hover:bg-slate-700/30"
                            title="Delete Course"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-base mb-1">{course.name}</h4>
                      
                      {/* Year & Semester Tag */}
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-500/10 border border-slate-500/20 font-medium">
                          Year {course.year || 3} - Sem {course.semester || 1}
                        </span>
                        <span>•</span>
                        <span>{course.category || 'Core'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-700/30 text-xs">
                      <span className="text-slate-400">Credits: <strong className="text-slate-200">{course.credits}</strong></span>
                      <span className="text-slate-400">Grade: <strong className="text-indigo-500 font-bold">{course.grade}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modal for Add & Edit Course */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-md p-6 rounded-2xl border shadow-xl ${darkMode ? 'bg-[#111827] border-[#1F293D] text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
              <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-700/30">
                <h3 className="text-base font-bold">{editingCourseId ? 'Edit Course Details' : 'Add New Course'}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Course Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EE3101"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                    >
                      <option value="Core">Core</option>
                      <option value="Technical Elective">Technical Elective</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Control Systems"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                  />
                </div>

                {/* Academic Year and Semester Selection */}
                <div className="grid grid-cols-2 gap-3 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                  <div>
                    <label className="block text-indigo-400 mb-1 font-semibold">Academic Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-indigo-400 mb-1 font-semibold">Semester</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                    >
                      <option value={1}>Semester 1</option>
                      <option value={2}>Semester 2</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      required
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Grade</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-800'}`}
                    >
                      {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-700/30">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition"
                  >
                    {editingCourseId ? 'Update Course' : 'Save Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}