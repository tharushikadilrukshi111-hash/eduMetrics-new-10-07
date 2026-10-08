import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, CheckCircle2, AlertCircle, Info, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
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

  // Calculate GPA dynamically from courses
  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((c) => {
      totalPoints += c.gradePoint * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
  };

  const gpa = calculateGPA();

  // Generate Auto-Calculated / Event-Driven Notifications
  const getAutoNotifications = () => {
    const list = [
      {
        id: 'sys-1',
        title: 'Platform Maintenance Notice',
        message: 'EduMetrics platform updates have been successfully deployed. All cloud sync services are running normally.',
        time: 'System Broadcast',
        type: 'info',
      }
    ];

    if (courses.length > 0) {
      list.push({
        id: 'course-1',
        title: 'Course Records Synchronized',
        message: `Successfully loaded ${courses.length} active course records from your database.`,
        time: 'Active Session',
        type: 'success',
      });
    }

    if (gpa >= 3.5) {
      list.push({
        id: 'gpa-success',
        title: '🏆 Academic Excellence Unlocked!',
        message: `Your current cumulative GPA is ${gpa.toFixed(2)}. You are maintaining an elite academic standing!`,
        time: 'Auto-Calculated',
        type: 'success',
      });
    } else if (gpa > 0 && gpa < 2.0) {
      list.push({
        id: 'gpa-warning',
        title: '⚠️ GPA Warning Alert',
        message: `Your current GPA is ${gpa.toFixed(2)}, which is below the safe threshold of 2.0. Consider focusing on upcoming assessments.`,
        time: 'Auto-Calculated',
        type: 'alert',
      });
    }

    return list;
  };

  const notifications = getAutoNotifications();

  return (
    <div className="min-h-screen bg-[#F2F7FC] text-[#173B63] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#5B8DEF]/20 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#173B63]">Notifications</h1>
            <p className="text-xs text-slate-500">Automated system alerts and academic standing updates.</p>
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
        <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          
          <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 p-3 rounded-xl text-[#5B8DEF]">
                  <Bell size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B63]">Live System & Academic Alerts</h3>
                  <p className="text-xs text-slate-500">Generated automatically based on your database records & GPA</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {notifications.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#F2F7FC] border border-[#5B8DEF]/20 rounded-xl p-4 flex items-start justify-between shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {item.type === 'success' && <CheckCircle2 className="text-[#48B8A6]" size={20} />}
                      {item.type === 'info' && <Info className="text-[#5B8DEF]" size={20} />}
                      {item.type === 'alert' && <AlertCircle className="text-[#F5B860]" size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-[#173B63] text-sm">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                      <span className="text-[11px] text-slate-400 mt-2 block">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}