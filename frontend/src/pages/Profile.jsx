import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, School, BookOpen, Key, CheckCircle, AlertCircle, Save, Moon, Sun, Camera } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePic: '',
    university: '',
    department: '',
    year: 3,
    semester: 1,
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        profilePic: parsedUser.profilePic || '',
        university: parsedUser.university || 'University of Ruhuna',
        department: parsedUser.department || 'Computer Engineering',
        year: parsedUser.year || 3,
        semester: parsedUser.semester || 1,
        currentPassword: '',
        newPassword: ''
      });
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = res.data.user || {
        ...user,
        name: formData.name,
        profilePic: formData.profilePic,
        university: formData.university,
        department: formData.department,
        year: formData.year,
        semester: formData.semester
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      const updatedUser = {
        ...user,
        name: formData.name,
        profilePic: formData.profilePic,
        university: formData.university,
        department: formData.department,
        year: Number(formData.year),
        semester: Number(formData.semester)
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F2F7FC] text-blue-950'}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-[#5B8DEF]/20'} backdrop-blur-xl border-b px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
          <div>
            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-blue-950'}`}>Student Profile</h1>
            <p className="text-xs text-slate-400">View and update your academic details.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950 hover:bg-slate-100'}`}
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#5B8DEF]/20'} p-6 rounded-2xl border shadow-sm transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-700/40">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#5B8DEF] text-white flex items-center justify-center font-bold text-xl shadow-md relative">
                  {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name ? user.name.charAt(0).toUpperCase() : 'S'
                  )}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-blue-950'}`}>{user?.name || 'Student'}</h2>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-xs font-medium bg-[#5B8DEF] hover:bg-[#4975d1] text-white rounded-xl shadow-sm transition"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {isEditing && (
                <div className="p-4 rounded-xl border border-dashed border-slate-500/30 flex flex-col items-center justify-center space-y-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-[#5B8DEF] flex items-center justify-center shadow-inner">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-[#5B8DEF]/10 hover:bg-[#5B8DEF]/20 text-[#5B8DEF] rounded-xl text-xs font-medium transition">
                      <Camera size={14} />
                      <span>Upload New Picture</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                    <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-9 p-2.5 rounded-xl border focus:outline-none transition ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className={`w-full pl-9 p-2.5 rounded-xl border opacity-60 cursor-not-allowed ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">University</label>
                  <div className="relative">
                    <School className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="university"
                      disabled={!isEditing}
                      value={formData.university}
                      onChange={handleChange}
                      className={`w-full pl-9 p-2.5 rounded-xl border focus:outline-none transition ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Department</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="department"
                      disabled={!isEditing}
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full pl-9 p-2.5 rounded-xl border focus:outline-none transition ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Academic Year</label>
                  <select
                    name="year"
                    disabled={!isEditing}
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none transition ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Semester</label>
                  <select
                    name="semester"
                    disabled={!isEditing}
                    value={formData.semester}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded-xl border focus:outline-none transition ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'} ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="border-t pt-4 border-slate-700/40 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Change Password (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-9 p-2.5 rounded-xl border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1.5">New Password</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-9 p-2.5 rounded-xl border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#F2F7FC] border-[#5B8DEF]/30 text-blue-950'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-[#5B8DEF] hover:bg-[#4975d1] text-white px-5 py-2.5 rounded-xl font-medium text-xs shadow-md transition"
                  >
                    <Save size={16} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}