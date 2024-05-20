import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmIMG.css';
import InstAI_icon from '../../image/instai_icon.png';


function ViewData() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagePreviews2, setImagePreviews2] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get('projectname');
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const upload_download = process.env.REACT_APP_UPLOAD_DOWNLOAD;
  const view_data = process.env.REACT_APP_AWS_VIEW_DATA;
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`?username=${id}&projectname=${projectname}`);
  //     console.log(response.data.images);
  //     setImagePreviews(response.data.images);
  //   } catch (error) {
  //     console.error('Error fetching image previews:', error);
  //   }
  // };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${upload_download}?username=${id}&projectname=${projectname}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log('Response from backend:', response.data);

      if (response.data.images && Array.isArray(response.data.images)) {
        // console.log('Received images:', response.data.images);
        setImagePreviews(response.data.images);
      } else {
        console.error('Invalid response format from backend:', response.data);
      }
    } catch (error) {
      console.error('Error fetching image previews:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id, projectname]);
  // const handleDeleteImage = async (index) => {
  //   const confirmDelete = window.confirm('確定要刪除圖片?');
  //   if (!confirmDelete) {
  //     return;
  //   }
  //   const updatedPreviews = [...imagePreviews];
  //   const deletedImage = updatedPreviews.splice(index, 1)[0];

  //   setImagePreviews(updatedPreviews);
  //   try {
  //     await axios.post(`?username=${id}&projectname=${projectname}`, { filename: deletedImage });
  //     alert('Delete success');
  //   } catch (error) {
  //     console.error('Error deleting image:', error);
  //   }
  // };

  // const handleDeletepreviewImage = (index) => {
  //   const updatedFiles = [...selectedFiles];
  //   const updatedPreviews = [...imagePreviews2];

  //   updatedFiles.splice(index, 1);
  //   updatedPreviews.splice(index, 1);

  //   setSelectedFiles(updatedFiles);
  //   setImagePreviews2(updatedPreviews);
  // };

  // const handleFileSelect = async (event) => {
  //   const files = event.target.files;
  //   const fileArray = Array.from(files);

  //   const allowedFileTypes = ['image/jpeg', 'image/png'];
  //   const filteredFiles = fileArray.filter((file) =>
  //     allowedFileTypes.includes(file.type)
  //   );

  //   setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);

  //   try {
  //     const previews = filteredFiles.map((file) => URL.createObjectURL(file));
  //     setImagePreviews2((prevPreviews) => [...prevPreviews, ...previews]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };


  const handleGoBack = () => {
    // console.log("檢查");
    navigate(`/Step?project=${projectname}`);
  };
  // const handleUpload = async () => {
  //   const confirmUpload = window.confirm('確定要新增圖片?');
  //   if (!confirmUpload) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   for (let i = 0; i < selectedFiles.length; ++i) {
  //     formData.append('file', selectedFiles[i]);
  //   }
  //   console.log(selectedFiles.length);
  //   try {
  //     const response = await axios.post(`?username=${id}&projectname=${projectname}`, formData);
  //     console.log(response.data);
  //     alert('Upload success');
  //     setSelectedFiles([]);
  //     setImagePreviews2([]);
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     alert('Upload failed');
  //   }
  // };

  return (


    // <div className="review-container">
    <div className="container-fluid p-0 mt-3">

      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
      </div>

      <div className='container-fluid bg-light p-0 border-top' style={{height:"100vh"}}>
        
        <div className='container border border-3 custom-border rounded mt-5' >
          <div className={`card  confirmform`} style={{ height: 100 }}>
            <h1 className="display-4  text-center text-light" style={{ fontWeight: 'bold' }}>Image Preview</h1>
          </div>



          <div className="container image-previews ">
            <div className='row row-cols-5 gy-5 justify-content-start' >
              {imagePreviews.map((preview, index) => (
                <div key={index} className='col'>

                  <div className="card text-bg-light" style={{ width: "250px", height: "200px" }}>
                    <div className='card-header'>No.{index + 1}</div>
                    <img className='card-img-top mt-1'

                      src={`${view_data}/${preview}`}

                      alt={`image ${index}`}
                      style={{ width: "auto", height: "150px" }}
                      loading="lazy"
                    />
                    <div className="card-body">


                    </div>
                  </div>
                  {/* <img className='img-thumbnail '

                src={`${view_data}/${preview}`}

                alt={`image ${index}`}
                style={{ width: '150px', height: 'auto' }}
                loading="lazy"
              />
              <p className='text-center '> No.{index}</p> */}
                  {/* <button className="delete-button" onClick={() => handleDeleteImage(index)}>
              刪除
            </button> */}
                </div>
              ))}
            </div>

            {/* {imagePreviews2.map((preview, index) => (
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
        ))} */}
          </div>
          {/* <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} /> */}

          {/* <button onClick={handleUpload}>Change</button> */}

          <div className=" d-flex  mb-3 justify-content-end ">

            <button className='btn btn-lg confirmButton' onClick={handleGoBack}>Go Back</button>
          </div>


        </div>

      </div>


    </div>
  );
}

export default ViewData;
