import React from 'react';
import { useNavigate } from 'react-router-dom';



const Home = () => {
const navigate = useNavigate();
  const handleDoctorLogin = () => {
    // Navigate to Doctor Login page (replace with your routing logic)
    navigate('/doctorlogin')
  };

  const handlePatientLogin = () => {
    // Navigate to Patient Login page (replace with your routing logic)
    navigate('/login')
  };

  // Define styles as JavaScript objects
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#e8f0fe', // Light blue background
      fontFamily: 'Poppins, sans-serif',
    },
    heading: {
        fontFamily: 'Poppins',
      color: '#2c3e50', // Darker shade for the heading
    },
    paragraph: {
      margin: '20px 0',
      color: '#34495e', // Text color
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px', // Space between buttons
    },
    button: {
      padding: '15px 25px',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    doctorButton: {
      backgroundColor: '#3498db', // Doctor button color
      color: 'white',
    },
    patientButton: {
      backgroundColor: '#2ecc71', // Patient button color
      color: 'white',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to MediVault</h1>
      <p style={styles.paragraph}>Please select your login type:</p>
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...styles.doctorButton }}
          onClick={handleDoctorLogin}
        >
          Login as Doctor
        </button>
        <button
          style={{ ...styles.button, ...styles.patientButton }}
          onClick={handlePatientLogin}
        >
          Login as Patient
        </button>
      </div>
    </div>
  );
};

export default Home;
