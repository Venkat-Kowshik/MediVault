import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PatientDashboard from './components/PatientDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import DoctorLogin from './components/DoctorLogin';
import Register from './components/Register';
import ForgotId from './components/ForgotId';
import PatientAccess from './components/PatientAccess';
import DoctorDashboard from './components/DoctorDashboard';
import Home from './components/Home';
import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patientsignup" element={<Signup />} />
        <Route path="/patientdashboard" element={<PatientDashboard />} />
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotid" element={<ForgotId />} />
        <Route path="/patientaccess" element={<PatientAccess />} />
      </Routes>
    </Router>
  );
};



export default App;
