import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate ,useLocation } from 'react-router-dom';
import '../Confirm/ConfirmIMG.css';
import InstAI_icon from '../../image/instai_icon.png';

function Data() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagePreviews2, setImagePreviews2] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get('projectname');
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8080/api/upload/download?username=${id}&projectname=${projectname}`, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data.images);
      setImagePreviews(response.data.images);
    } catch (error) {
      console.error('Error fetching image previews:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id, projectname]);

  const handleDeleteImage = async (index) => {
    const confirmDelete = window.confirm('確定要刪除圖片?');
    if (!confirmDelete) {
      return;
    }
    const updatedPreviews = [...imagePreviews];
    const deletedImage = updatedPreviews.splice(index, 1)[0];

    setImagePreviews(updatedPreviews);
    try {
      await axios.post(`http://localhost:8080/api/upload/deleteimg?username=${id}&projectname=${projectname}`, { filename: deletedImage });
      alert('Delete success');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleDeletepreviewImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews2];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews2(updatedPreviews);
  };
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
  
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
  
    try {
      const previews = filteredFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews2((prevPreviews) => [...prevPreviews, ...previews]);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleGoBack = () => {
    const confirmed =window.confirm("Remenber to check your requirement ");
    if (!confirmed) {
      const userConfirmed = window.confirm('You have not confirmed the requirement. Are you sure you want to go back?');
      if (!userConfirmed) {
        return; 
      }
    }
    if (confirmed) {
      window.alert('See your model later');
    }

    navigate(`/Model?project=${projectname}`);
  };
  const handleUpload = async () => {
    const confirmUpload = window.confirm('確定要新增圖片?');
    if (!confirmUpload) {
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; ++i) {
      formData.append('file', selectedFiles[i]);
    }
    console.log(selectedFiles.length);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(`http://localhost:8080/api/upload/upload?username=${id}&projectname=${projectname}`, formData, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      alert('Upload success');
      setSelectedFiles([]);
      setImagePreviews2([]);
      fetchData();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Upload failed');
    }
  };

  return (
    <div className="review-container">
      <div className="main-InstAI-icon">
        <img src={InstAI_icon} className="logo" alt="Your Logo" />
      </div>
      <div>
      </div>
      <h2>Upload more data</h2>
      <div className="image-previews">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="image-preview">
            <img
              src={`http://localhost:8080${preview}`}
              alt={`image ${index}`}
              style={{ width: '128px', height: '128px' }}
              loading="lazy"
            />
            <button className="delete-button" onClick={() => handleDeleteImage(index)}>
              刪除
            </button>
          </div>
        ))}
        {imagePreviews2.map((preview, index) => (
        <div key={index} className="image-preview">
          <img
              src={preview}
              alt={`image ${index}`}
              style={{ width: '128px', height: '128px' }}
              loading="lazy"
            />
          <button className="delete-button" onClick={() => handleDeletepreviewImage(index)}>
              刪除
          </button>
        </div>
        ))}
      </div>
      <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default Data;
