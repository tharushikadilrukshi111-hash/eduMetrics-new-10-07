import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, Trophy, Star, CheckCircle, User, Zap, Flame, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Achievements() {
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

  const gpaNum = parseFloat(calculateGPA());

  // XP & Level Calculation based on courses & GPA
  const totalXP = courses.length * 150 + Math.floor(gpaNum * 100);
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const xpProgress = totalXP % 500;

  const badges = [
    {
      id: 1,
      title: 'Academic Excellence',
      description: 'Achieve a Cumulative GPA of 3.5 or higher',
      icon: Trophy,
      unlocked: gpaNum >= 3.5,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 2,
      title: 'Course Pioneer',
      description: 'Enrol and track your first 3 courses',
      icon: Star,
      unlocked: courses.length >= 3,
      color: 'text-[#5B8DEF] bg-[#5B8DEF]/10 border-[#5B8DEF]/30'
    },
    {
      id: 3,
      title: 'Consistent Learner',
      description: 'Maintain active course records and tracking',
      icon: CheckCircle,
      unlocked: courses.length > 0,
      color: 'text-[#48B8A6] bg-[#48B8A6]/10 border-[#48B8A6]/30'
    }
  ];

  const recentHistory = [
    { id: 1, action: 'Unlocked Badge: Consistent Learner', time: 'Recently', icon: CheckCircle, color: 'text-[#48B8A6]' },
    { id: 2, action: `Earned XP: +${courses.length * 150} Total Course Points`, time: 'Active Session', icon: Zap, color: 'text-[#5B8DEF]' }
  ];

  return (
    <div className="min-h-screen bg-[#F2F7FC] text-[#173B63] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#5B8DEF]/20 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#173B63]">Achievements & Milestones</h1>
            <p className="text-xs text-slate-500">Track your academic badges, level progress, and streaks.</p>
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
          
          {/* Top Row: Level & Streak Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* XP Level Card */}
            <div className="bg-white border border-[#5B8DEF]/20 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">Academic Level</p>
                  <h3 className="text-3xl font-extrabold text-[#5B8DEF] mt-1">Level {currentLevel}</h3>
                </div>
                <div className="p-3 bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 rounded-xl text-[#5B8DEF]">
                  <Zap size={22} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>XP Progress</span>
                  <span className="font-medium text-[#173B63]">{xpProgress} / 500 XP</span>
                </div>
                <div className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/20 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#5B8DEF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(xpProgress / 500) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Streak Tracker Card */}
            <div className="bg-white border border-[#5B8DEF]/20 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">Study Streak</p>
                  <h3 className="text-3xl font-extrabold text-[#F5B860] mt-1">5 Days 🔥</h3>
                </div>
                <div className="p-3 bg-[#F5B860]/10 border border-[#F5B860]/30 rounded-xl text-[#F5B860]">
                  <Flame size={22} />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">Keep logging in daily to maintain your active streak!</p>
            </div>

            {/* Total XP Card */}
            <div className="bg-white border border-[#5B8DEF]/20 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500">Total Score Earned</p>
                  <h3 className="text-3xl font-extrabold text-[#48B8A6] mt-1">{totalXP} XP</h3>
                </div>
                <div className="p-3 bg-[#48B8A6]/10 border border-[#48B8A6]/30 rounded-xl text-[#48B8A6]">
                  <Award size={22} />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">Accumulated via courses & high academic standing.</p>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-[#F5B860]/10 border border-[#F5B860]/30 p-3 rounded-xl text-[#F5B860]">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#173B63]">Your Badges & Unlocks</h3>
                <p className="text-xs text-slate-500">Badges are automatically unlocked based on your academic performance.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {badges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div 
                    key={badge.id} 
                    className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                      badge.unlocked 
                        ? 'bg-[#F2F7FC]/60 border-[#5B8DEF]/30 shadow-sm' 
                        : 'bg-white border-slate-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className={`p-3 rounded-xl border ${badge.color}`}>
                          <IconComponent size={22} />
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                          badge.unlocked 
                            ? 'bg-[#48B8A6]/10 text-[#48B8A6] border-[#48B8A6]/30' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {badge.unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#173B63] text-base mb-1">{badge.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unlock History Feed */}
          <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="text-[#5B8DEF]" size={18} />
              <h3 className="text-base font-bold text-[#173B63]">Recent Milestone Activity</h3>
            </div>
            <div className="space-y-3">
              {recentHistory.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between bg-[#F2F7FC] border border-[#5B8DEF]/20 p-3.5 rounded-xl text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-white border border-[#5B8DEF]/20 ${item.color}`}>
                        <ItemIcon size={16} />
                      </div>
                      <span className="text-[#173B63] font-medium">{item.action}</span>
                    </div>
                    <span className="text-slate-500">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}