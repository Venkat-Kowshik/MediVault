import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css'


const Login = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:5050/login', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar, password }),
    });

    if (response.ok) {
      setIsOtpSent(true);  // Show OTP field after sending OTP
      alert('OTP sent to your phone');
    } else {
      alert('Login failed');
    }
  };

const handleSignUp = () => {
  navigate('/patientsignup')
}

  const handleOtpVerification = async () => {
    localStorage.setItem('username',aadhaar)
    // navigate('/patientdashboard');
    const response = await fetch('http://127.0.0.1:5050/verify-login-otp', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar, otp }),
    });

    if (response.ok) {
      alert('Login successful');
      localStorage.setItem('username',aadhaar)
      navigate('/patientdashboard');  // Redirect to PatientDashboard
    } else {
      alert('OTP verification failed');
    }
  };

  return (

    // <div id="container">
    //     <div id="cont1" style={{backgroundImage: back}}>
    //         <div id="bar">
    //             <div><img id="logo" src={odin} /></div>
    //             <div >Odin</div>
    //         </div>
    //     </div>
    //     <div id="cont2">
    //         <div>
    //             <h2>This is not a real online service! You know you need something like this in your life to realize
    //                 your deepest dreams.</h2>
    //             <h2>Sign up <em>now</em> to get started</h2>
    //             <h2>You <em>know</em> you want to.</h2>
    //         </div>
    //         <br />
    //         <form id="myForm">
    //             <h2>Lets Do This!</h2>
    //             <div id="details">
    //                 <div>
    //                     <label htmlFor="fname">First Name</label>
    //                     <input type="text" name="fname" id="fname" required />
    //                 </div>
    //                 <div>
    //                     <label htmlFor="lname">Last Name</label>
    //                     <input type="text" name="lname" id="lname" />
    //                 </div>
    //                 <div>
    //                     <label htmlFor="email">E-mail</label>
    //                     <input type="email" name="email" id="email" required />
    //                 </div>
    //                 <div>
    //                     <label htmlFor="phno">Phone Number</label>
    //                     <input type="number" name="phno" id="phno" min="999999999" required />
    //                 </div>
    //                 <div id = "pwdcontainer">
    //                     <label htmlFor="pwd" id = "pwdlabel">
    //                         <div>Password</div>
    //                         <div id="pwdStatus"></div>
    //                     </label>
    //                     <input type="password" name="pwd" id="pwd" required />
    //                     <div id="errcont">
    //                         <span id="lenErr">Password must be atleast 6 characters</span>
    //                         <span id="numErr">Password must contain a number</span>
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <label htmlFor='cpwd'>Confirm Password</label>
    //                     <input type="password" name="cpwd" id="cpwd" required />
    //                     <span id="passMatch">Passwords do not match</span>
    //                 </div>
    //             </div>
    //         </form>
    //         <input type="submit" form="myForm" id="sub" value="Create Account" />
    //     </div>
    //   </div>


    <div className='patient-login-root'>
    <h2>Login</h2>
    <div className='patient-login-container'>
      {!isOtpSent ? (
        <div className='login-fields'>
          <input type="text" placeholder="Aadhaar" value={aadhaar} onChange={e => setAadhaar(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button style={{fontSize: '0.8em',maxHeight: '30px',maxWidth: '150px',margin: '0px auto',padding: '10px 5px'}} onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div className='login-fields'>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={handleOtpVerification}>Verify OTP</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Login;
