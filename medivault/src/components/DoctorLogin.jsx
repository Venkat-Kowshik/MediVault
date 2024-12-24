import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/doctorlogin.css'


const DoctorLogin = () => {
    const [formData, setFormData] = useState({
        uniqueId: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [doctorName, setDoctorName] = useState('');  // State to store doctor's name
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/doctorlogin', formData);
            if (response.data.success) {

                localStorage.setItem('doctorname',response.data.doctor)
                setDoctorName(response.data.doctorName);  // Set the doctor's name in state
                setMessage(`Welcome, Dr. ${response.data.doctorName}!`);  // Display a welcome message
                navigate('/patientaccess');  // Navigate to patient access page
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred during login.');
        }
    };

    const handleForgotId = () => {
        navigate('/forgotid');  // Navigate to Forgot ID page
    };

    const handleRegister = () => {
        navigate('/register');  // Navigate to Register page
    };

    return (
        <div className='doctor-login-root'>
        <div className="login-container">
            <h2>Doctor Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="uniqueId"
                    placeholder="Unique ID"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            
            {/* Forgot ID and Register buttons */}
            <button onClick={handleForgotId}>Forgot ID?</button>
            <button onClick={handleRegister}>Register as a New Doctor</button>

            {/* Display the doctor name at the bottom-left corner */}
            {doctorName && (
                <div className="footer">
                    <p>Logged in as: Dr. {doctorName}</p>
                </div>
            )}

            {/* CSS styles for the footer */}
            <style>{`
                .footer {
                    position: fixed;
                    left: 10px;
                    bottom: 10px;
                    background-color: #f8f9fa;
                    padding: 5px 10px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    font-size: 14px;
                    color: #333;
                }
                .login-container button {
                    margin: 10px;
                    padding: 8px 16px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .login-container button:hover {
                    background-color: #0056b3;
                }
                    .body{
                    background-color: #FFDEAD;
                    }
            `}</style>
        </div>
        </div>
    );
};

export default DoctorLogin;
