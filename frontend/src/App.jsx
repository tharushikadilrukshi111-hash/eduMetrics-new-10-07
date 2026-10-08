import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Courses from './pages/Courses'; 
import Analytics from './pages/Analytics';
import Calculator from './pages/Calculator';
import Achievements from './pages/Achievements';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} /> 
        <Route path="/analytics" element={<Analytics />} /> 
        <Route path="/calculator" element={<Calculator />} /> 
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;