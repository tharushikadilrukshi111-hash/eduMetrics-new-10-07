import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calculator as CalcIcon, Plus, Trash2, Award, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Calculator() {
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([
    { id: 1, code: 'EE3101', credits: 3, grade: 'A' },
    { id: 2, code: 'EE3102', credits: 3, grade: 'A-' }
  ]);
  const [targetGPA, setTargetGPA] = useState(3.75);
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
  }, [navigate, token]);

  // Grade point mapping
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'E': 0.0, 'F': 0.0
  };

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), code: '', credits: 3, grade: 'A' }]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const calculateSimulatedGPA = () => {
    if (rows.length === 0) return '0.00';
    let totalPoints = 0;
    let totalCredits = 0;
    rows.forEach(r => {
      const cr = Number(r.credits) || 0;
      const pts = gradePoints[r.grade] || 0;
      totalPoints += pts * cr;
      totalCredits += cr;
    });
    return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
  };

  const simGPA = parseFloat(calculateSimulatedGPA());
  const targetNum = parseFloat(targetGPA) || 4.0;
  const progressPercent = Math.min(100, Math.max(0, (simGPA / targetNum) * 100));

  return (
    <div className="min-h-screen bg-[#F2F7FC] text-[#173B63] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#5B8DEF]/20 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#173B63]">GPA Calculator & Simulator</h1>
            <p className="text-xs text-slate-500">Plan your semester grades and estimate your GPA.</p>
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
          
          {/* Top Result Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#5B8DEF]/20 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Simulated Semester GPA</p>
                <h3 className="text-3xl font-extrabold text-[#5B8DEF] mt-1">{calculateSimulatedGPA()}</h3>
                <p className="text-xs text-slate-400 mt-1">Based on simulated courses below</p>
              </div>
              <div className="bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 p-4 rounded-xl text-[#5B8DEF]">
                <CalcIcon size={28} />
              </div>
            </div>

            <div className="bg-white border border-[#5B8DEF]/20 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-slate-500">Target GPA Goal</p>
                <input 
                  type="number" 
                  step="0.01" 
                  max="4.0" 
                  value={targetGPA} 
                  onChange={(e) => setTargetGPA(e.target.value)}
                  className="w-20 bg-[#F2F7FC] border border-[#5B8DEF]/30 text-right rounded-lg px-2 py-1 text-sm text-[#5B8DEF] font-bold focus:outline-none focus:border-[#5B8DEF]"
                />
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress to Target</span>
                  <span className="font-medium text-[#173B63]">{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/20 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#5B8DEF] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulator Table Section */}
          <div className="bg-white border border-[#5B8DEF]/20 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#173B63]">GPA Simulation Table</h3>
              <button
                onClick={handleAddRow}
                className="flex items-center space-x-1.5 bg-[#5B8DEF] hover:bg-[#4975d1] text-white font-medium px-4 py-2 rounded-xl shadow-sm transition text-xs"
              >
                <Plus size={16} />
                <span>Add Row</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#5B8DEF]/20 text-slate-500 text-xs">
                    <th className="py-2.5 px-3 font-semibold">Course Code / Name</th>
                    <th className="py-2.5 px-3 font-semibold">Credits</th>
                    <th className="py-2.5 px-3 font-semibold">Expected Grade</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-[#5B8DEF]/10 text-[#173B63]">
                      <td className="py-3 px-3">
                        <input 
                          type="text" 
                          value={row.code}
                          onChange={(e) => handleChange(row.id, 'code', e.target.value)}
                          placeholder="e.g. EC3201"
                          className="w-full bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-lg p-2 text-xs text-[#173B63] focus:outline-none focus:border-[#5B8DEF]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input 
                          type="number" 
                          min="1" 
                          max="6"
                          value={row.credits}
                          onChange={(e) => handleChange(row.id, 'credits', e.target.value)}
                          className="w-20 bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-lg p-2 text-xs text-[#173B63] focus:outline-none focus:border-[#5B8DEF]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <select 
                          value={row.grade}
                          onChange={(e) => handleChange(row.id, 'grade', e.target.value)}
                          className="bg-[#F2F7FC] border border-[#5B8DEF]/30 rounded-lg p-2 text-xs text-[#5B8DEF] font-bold focus:outline-none focus:border-[#5B8DEF]"
                        >
                          {Object.keys(gradePoints).map(g => (
                            <option key={g} value={g} className="bg-white text-[#173B63]">{g} ({gradePoints[g]})</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button 
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}