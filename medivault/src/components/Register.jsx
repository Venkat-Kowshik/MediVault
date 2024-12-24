import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/register', formData);
            if (response.data.success) {
                alert(`Registration successful! Your unique ID is: ${response.data.uniqueId}`);
                navigate('/');
            } else {
                alert('Doctor already registered.');
            }
        } catch (error) {
            console.error('Error during registration:', error);  // Log detailed error
            alert('Registration failed. Please try again.');    // User-friendly error
        }
    };
    

    return (
        <div className="register-container">
            <h2>Doctor Registration</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    onChange={handleChange} 
                    required 
                />
                <br/><br/>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    required 
                />
                <br/><br/>
                <input 
                    type="text" 
                    name="phone" 
                    placeholder="Phone Number" 
                    onChange={handleChange} 
                    required 
                />  <br/><br/>
                <input 
                    type="text" 
                    name="specialty" 
                    placeholder="Specialist In" 
                    onChange={handleChange} 
                    required 
                />
                  <br/><br/>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                />
               <br/><br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
