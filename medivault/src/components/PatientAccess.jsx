import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientAccess = () => {
    const [patientData, setPatientData] = useState({
        aadhaar: '',
        otp: ''
    });
    const [message, setMessage] = useState('');
    const [patientRecords, setPatientRecords] = useState(null);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/verify-patient', patientData);
            if (response.data.success) {
                setMessage('Patient access granted');
                setPatientRecords(response.data.records);  // Display decrypted records
                localStorage.setItem('username',response.data.uniqueId);
                navigate('/doctordashboard')

            } else {
                setMessage('Invalid Aadhaar or OTP');
            }
        } catch (error) {
            console.error('Error verifying patient:', error);
            setMessage('An error occurred during patient verification.');
        }
    };

    return (
        <div className='doctor-login-root'>
        <div className="login-container">
            <h2>Patient Access</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="aadhaar"
                    placeholder="Patient Aadhaar"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="text"
                    name="otp"
                    placeholder="Patient OTP"
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Verify</button>
            </form>
            {message && <p>{message}</p>}
            {patientRecords && (
                <div className="patient-records">
                    <h3>Decrypted Medical Records:</h3>
                    <p>{patientRecords}</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default PatientAccess;



//// src/components/PatientAccess.jsx
//import { useState } from 'react';
//import axios from 'axios';
//console.log("Hello is this visible?")
//const PatientAccess = () => {
//    const [patientData, setPatientData] = useState({
//        aadhaar: '',
//        otp: ''
//    });
//    const [message, setMessage] = useState('');
//
//    const handleChange = (e) => {
//        const { name, value } = e.target;
//        setPatientData((prevState) => ({
//            ...prevState,
//            [name]: value
//        }));
//    };
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            const response = await axios.post('http://localhost:5000/verify-patient', patientData);
//            if (response.data.success) {
//                setMessage('Patient access granted');
//                // Navigate to the patient's data page or display the data
//                // Example: navigate('/patient-data');
//            } else {
//                setMessage('Invalid Aadhaar or OTP');
//            }
//        } catch (error) {
//            console.error('Error verifying patient:', error);
//            setMessage('An error occurred during patient verification.');
//        }
//    };
//
//    return (
//        <div className="patient-access-container">
//            <h2>Patient Access</h2>
//            <form onSubmit={handleSubmit}>
//                <input
//                    type="text"
//                    name="aadhaar"
//                    placeholder="Patient Aadhaar"
//                    onChange={handleChange}
//                    required
//                />
//                <br />
//                <input
//                    type="text"
//                    name="otp"
//                    placeholder="Patient OTP"
//                    onChange={handleChange}
//                    required
//                />
//                <br />
//                <button type="submit">Verify</button>
//            </form>
//            {message && <p>{message}</p>}
//        </div>
//    );
//};
//
//export default PatientAccess;
//




//GO through this comment 
//Task:

//When doctor enters the otp 
//1. it has to cross verify the otp from patients side as well and then it has to access the decrypted file from the patient side and files has to be displayed 
//
//things to remember:
//have to work on cross projects
//when doctor gives the key it has to directly display the files present in database
//
//when doctor enters otp then automatically the document present with respective user has to be downloaded from the 
//data base that means decryption have to be automated 
//
//when submit in doctors side got clicked a function has to transport the aadhar number and then there should be a function by accessing the aadhar as its key it will search
//for its existence in the database and returns it to the decryption function. after decryption they have to be printed on screen of doctors side