import React, { useEffect, useState,useContext } from 'react';
import Sidebar from './Sidebar';


import '../assets/pdash.css'

const DoctorDashboard = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [blockingModal, setBlockingModal] = useState(false);
  const [addingNewEntry, setAddingNewEntry] = useState(false);

  // Handle File Upload

  const handleFileChange = (event) => {
    
    setPdfFile(event.target.files[0]);
  };

  // Handle Form Submission (Upload File)
  const handleSubmit = async () => {
    const formData = new FormData();
    let username=localStorage.getItem('username')
    formData.append('pdf', pdfFile);
    // formData.append('username',localStorage.getItem('username'))
    console.log(localStorage.getItem('username'))
    try {
      const response = await fetch(`http://127.0.0.1:8000/upload?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      if (response.ok || response.type === 'opaque') {
        console.log('Submitted successfully');
        setBlockingModal(false);
        setAddingNewEntry(false);
        getFileList();
      } else {
        alert('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // Download PDF
//   const downloadPdf = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:8000/download', {
//         method: 'GET',
//         mode: 'no-cors',
//       });
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       alert('An error occurred while downloading the PDF.');
//     }
//   };

  // View PDF
  const viewPdf = async (filename) => {
    console.log("calling " + filename);
    try {

      const response = await fetch(`http://127.0.0.1:8000/download?filename=${encodeURIComponent(filename)}`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  // Get File List
  const getFileList = async () => {
    
    try {
      // console.log(userName)
      const response = await fetch(`http://127.0.0.1:8000/filelist?username=${localStorage.getItem('username')}`,{
        method: 'GET',
        mode: 'cors',
      }
    );
      const body = await response.json();

      if (response.ok) {
        console.log(body);
        setFileList(body);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };
  
  const [patientName,setPatientName] = useState('')

    const getPatientName = async () => {
      try {
        let username=localStorage.getItem('username')
        const response = await fetch(`http://127.0.0.1:8000/getname?username=${encodeURIComponent(username)}`, {
          method: 'GET',
          mode: 'cors',
        });

        let body =await response.json();
        if (response.ok) {
          setPatientName(body)
        }

      } catch (error) {
        console.error( error);
      }
    }

  useEffect(() => {
    getFileList();
    getPatientName();
  }, []);


  return (
    <div id='root2'>
      {blockingModal && <div className='blocking-modal' onClick={() => { setBlockingModal(false); setAddingNewEntry(false); }}></div>}
      {addingNewEntry && (
        <form className="project-form">
          <h3>Upload File</h3>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleSubmit} className="stask">Submit</button>
        </form>
      )}
      <Sidebar data={fileList} onViewPdf={viewPdf} onNewEntry={setBlockingModal} onAddEntry={setAddingNewEntry} isDoctor={true} />
      <div className='viewer'>
        <div>
            Viewing reports of {patientName}
        </div>
        <div id="pdf-container">
          {pdfUrl && <iframe src={pdfUrl} style={{ width: '700px', height: '700px' }} title="PDF Viewer"></iframe>}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
