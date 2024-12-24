import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const response = await fetch('http://127.0.0.1:5050/signup', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar, phone, name, password }),
    });

    if (response.ok) {
      setIsOtpSent(true);  // Show OTP field after sending OTP
      alert('OTP sent to your phone');

    } else {
      alert('Signup failed');
    }
  };

  const handleOtpVerification = async () => {
    const response = await fetch('http://127.0.0.1:5050/verify-signup-otp', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar, otp }),
    });

    if (response.ok) {
      alert('Signup successful');
      localStorage.setItem('username',aadhaar)
      navigate('/login');  // Redirect to PatientDashboard
    } else {
      alert('OTP verification failed');
    }
  };

  return (
    <div className='patient-login-root'>
    <h2>Sign Up</h2>
    <div className='patient-login-container' style={{gap:'10px'}}>
      {!isOtpSent ? (
        <>
          <input type="text" placeholder="Aadhaar" value={aadhaar} onChange={e => setAadhaar(e.target.value)} />
          <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleSignup}>Sign Up</button>
        </>
      ) : (
        <>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={handleOtpVerification}>Verify OTP</button>
        </>
      )}
    </div>
    </div>
  );
};

export default Signup;
