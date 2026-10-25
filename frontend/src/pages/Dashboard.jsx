import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Award, BookOpen, GraduationCap, TrendingUp, Calendar, Layers, ChevronRight, User 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const token = localStorage.getItem('token');

  // Grade Point Mapping
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'E': 0.0
  };

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
      const res = await axios.get('http://edu-metrics-new-10-07.vercel.app/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses', err);
    }
  };

  // Helper Function: Calculate GPA for a given set of courses
  const calculateGPA = (courseList) => {
    if (!courseList || courseList.length === 0) return '0.00';
    let totalPoints = 0;
    let totalCredits = 0;

    courseList.forEach(course => {
      const points = gradePoints[course.grade] ?? 0;
      const credits = Number(course.credits) || 0;
      totalPoints += points * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  // Overall Cumulative GPA
  const overallGPA = calculateGPA(courses);
  const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  // Group Courses by Year & Semester dynamically
  const getCategorizedData = () => {
    const years = [1, 2, 3, 4];
    const categories = [];

    years.forEach(yearNum => {
      const yearCourses = courses.filter(c => Number(c.year) === yearNum);
      if (yearCourses.length > 0) {
        const sem1Courses = yearCourses.filter(c => Number(c.semester) === 1);
        const sem2Courses = yearCourses.filter(c => Number(c.semester) === 2);

        categories.push({
          year: yearNum,
          yearGPA: calculateGPA(yearCourses),
          totalYearCourses: yearCourses.length,
          semesters: [
            { sem: 1, gpa: calculateGPA(sem1Courses), count: sem1Courses.length, courses: sem1Courses },
            { sem: 2, gpa: calculateGPA(sem2Courses), count: sem2Courses.length, courses: sem2Courses }
          ]
        });
      }
    });

    return categories;
  };

  const categorizedData = getCategorizedData();

  // Filter courses for chart & detailed view
  const filteredCourses = courses.filter(c => {
    if (selectedFilter === 'ALL') return true;
    const [y, s] = selectedFilter.split('-'); // e.g. "Y1-S1"
    return Number(c.year) === Number(y) && Number(c.semester) === Number(s);
  });

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-[#111827]/90 border-[#1F293D]' : 'bg-white/90 border-slate-200'} backdrop-blur-xl border-b px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm`}>
          <div>
            <h1 className="text-lg font-bold">Academic Overview</h1>
            <p className="text-xs text-slate-400">Welcome back, {user?.name || 'Student'}</p>
          </div>

          <button
              onClick={() => navigate('/profile')}
              className={`flex items-center space-x-2 border px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${darkMode ? 'bg-[#151D2A] border-[#2D3748] text-slate-200' : 'bg-[#F8FAFC] border-slate-200 text-slate-700'}`}
          >
  <User size={15} />
  <span>{user?.name || 'Tharushika Dilrukshi'}</span>
</button>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Top Overall Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Cumulative GPA Card */}
            <div className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between ${darkMode ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-900/50' : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-600'}`}>
              <div>
                <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Overall Cumulative GPA</p>
                <h2 className="text-4xl font-extrabold mt-1">{overallGPA}</h2>
                <p className="text-xs opacity-75 mt-1">Based on {courses.length} subjects</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
                <Award size={32} className="text-amber-300" />
              </div>
            </div>

            {/* Total Earned Credits */}
            <div className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between ${darkMode ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Completed Credits</p>
                <h2 className="text-3xl font-extrabold mt-1">{totalCredits}</h2>
                <p className="text-xs text-slate-400 mt-1">Academic Credit Load</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
                <BookOpen size={28} />
              </div>
            </div>

            {/* Current Academic Standing */}
            <div className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between ${darkMode ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Academic Level</p>
                <h2 className="text-xl font-bold mt-1">Year {user?.year || 3} - Sem {user?.semester || 1}</h2>
                <p className="text-xs text-emerald-500 font-medium mt-1">Good Academic Standing</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <GraduationCap size={28} />
              </div>
            </div>

          </div>

          {/* YEAR-WISE & SEMESTER-WISE BREAKDOWN SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Academic Year & Semester Breakdown</h3>
                <p className="text-xs text-slate-400">GPA categorized by academic years and semesters.</p>
              </div>
            </div>

            {categorizedData.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center text-xs text-slate-400 ${darkMode ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
                No course data available yet. Add courses with respective Year & Semester to see the breakdown.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedData.map((yearData) => (
                  <div key={yearData.year} className={`p-5 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
                    
                    {/* Year Header */}
                    <div className="flex justify-between items-center border-b pb-3 border-slate-700/30">
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} className="text-indigo-500" />
                        <h4 className="font-bold text-sm">Year {yearData.year} Overview</h4>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        Year GPA: {yearData.yearGPA}
                      </span>
                    </div>

                    {/* Semesters inside Year */}
                    <div className="space-y-2">
                      {yearData.semesters.map((semData) => (
                        <div 
                          key={semData.sem}
                          onClick={() => setSelectedFilter(`${yearData.year}-${semData.sem}`)}
                          className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition text-xs ${selectedFilter === `${yearData.year}-${semData.sem}` ? 'border-indigo-500 bg-indigo-500/10' : darkMode ? 'bg-[#151D2A] border-[#2D3748] hover:border-slate-600' : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'}`}
                        >
                          <div>
                            <span className="font-semibold block">Semester {semData.sem}</span>
                            <span className="text-slate-400 text-[11px]">{semData.count} Subjects</span>
                          </div>
                          <div className="text-right flex items-center space-x-2">
                            <div>
                              <span className="text-slate-400 text-[10px] block">GPA</span>
                              <span className="font-bold text-indigo-500 text-sm">{semData.gpa}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* VISUAL ANALYTICS & COURSE LIST */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-700/30">
              <div>
                <h3 className="text-base font-bold">Grade Performance Analytics</h3>
                <p className="text-xs text-slate-400">
                  Showing performance for: <span className="font-bold text-indigo-500">{selectedFilter === 'ALL' ? 'All Semesters' : `Year ${selectedFilter.split('-')[0]} - Semester ${selectedFilter.split('-')[1]}`}</span>
                </p>
              </div>

              {selectedFilter !== 'ALL' && (
                <button
                  onClick={() => setSelectedFilter('ALL')}
                  className="text-xs text-indigo-500 hover:underline font-medium self-start sm:self-auto"
                >
                  Clear Filter (Show All)
                </button>
              )}
            </div>

            {/* Recharts Bar Display */}
            {filteredCourses.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredCourses}>
                    <XAxis dataKey="code" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 4]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#151D2A' : '#FFFFFF', 
                        borderColor: '#2D3748', 
                        borderRadius: '12px',
                        fontSize: '12px' 
                      }} 
                    />
                    <Bar dataKey="credits" radius={[8, 8, 0, 0]}>
                      {filteredCourses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366F1' : '#3B82F6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No subjects recorded for this selected semester filter.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}