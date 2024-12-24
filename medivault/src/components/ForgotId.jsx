// src/components/ForgotId.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ForgotId = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [message, setMessage] = useState('');
    const [uniqueId, setUniqueId] = useState(''); // State to hold the Unique ID
    const navigate = useNavigate(); // Initialize navigate

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
            const response = await axios.post('http://localhost:5050/forgotid', formData);
            if (response.data.success) {
                setUniqueId(response.data.uniqueId); // Set the Unique ID in state
                setMessage(`Your Unique ID is: ${response.data.uniqueId}`);
            } else {
                setMessage(response.data.message);
                setUniqueId(''); // Reset Unique ID if there's an error
            }
        } catch (error) {
            console.error('Error occurred while fetching Unique ID:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleHomeRedirect = () => {
        navigate('/doctorlogin'); // Navigate to the home (login) page
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-semibold mb-4">Forgot Unique ID</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    name="name"
                    placeholder="Doctor's Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 mb-4 border border-gray-300"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="p-2 mb-4 border border-gray-300"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2">Retrieve Unique ID</button>
            </form>
            {message && <p className="mt-4 text-red-600">{message}</p>}
            {uniqueId && ( // If uniqueId is set, show the button
                <div className="mt-4">
                    <button onClick={handleHomeRedirect} className="bg-green-500 text-white p-2">
                        Go to Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForgotId;
