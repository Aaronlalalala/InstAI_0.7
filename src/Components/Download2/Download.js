import React, { useState,useEffect } from 'react';
import styles from './Download.module.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import InstAI_icon from "../../image/instai_icon.png";


function Download2() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  //const [username, setUsername] = useState(""); 
  //const [filename, setFilename] = useState(""); 
  // 文件選擇
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
  
    // 過濾文件
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );
 
    //setSelectedFiles(filteredFiles);
    setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);//modify:選擇檔案可以不要覆蓋先前選擇的檔案，而是可以疊加圖片上去

    try {
      // 刪掉axios.get
      const previews = filteredFiles.map((file) => URL.createObjectURL(file));
      //setImagePreviews([...imagePreviews, ...previews]);
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);//modify:選擇檔案可以不要覆蓋先前選擇的檔案，而是可以疊加圖片上去
    } catch (error) {
      console.error('發生錯誤:', error);
    }
  };

  // 文件下載 //modified
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file]));
    a.setAttribute("download", file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 處理刪除單一圖片
  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  useEffect(() => {
    
    console.log('Selected Files:', selectedFiles.length);
  }, [selectedFiles]);

  // 刪除預覽
  const handleDeleteAllPreviews = () => {
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  // 下載預覽 //modified
  const handleDownloadAll = () => {
    selectedFiles.forEach((file) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([file]));
      console.log(a.href)
      a.setAttribute("download", file.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };
  
  const handleupload = async () => {
    // 檢查是否有選擇任何檔案
    if (selectedFiles.length === 0) {
      alert('請選擇要上傳的圖片!');
    }
    else{
      const confirmDelete = window.confirm("確定要上傳圖片?");
      if (!confirmDelete) {
        return;
      }
      const uploaded = [...selectedFiles];
      const formData = new FormData();
      for(let i =0;i<uploaded.length;++i){
        formData.append('file', uploaded[i]);
      }
  
      try {
        const response = await axios.post(`http://localhost:8080/api/upload/upload?username=${id}&projectname=${projectname}`, formData)
        .then(response => {
          console.log(response.data);
          // Handle success
          alert('upload success')
        })
        .catch(error => {
          console.error(1233+error);
          // Handle error
        });
        console.log(response);
        const response2 = await axios.post(
          `http://localhost:8080/api/project/confirmstep/?step=1&username=${id}&projectname=${projectname}`
        );
        console.log('step updated successfully:', response2.data);
        localStorage.setItem(`firstPage_${id}_${projectname}`, 'true');
        navigate(`/Step?id=${id}&project=${projectname}`);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    }
  };

  return (
    // <div className={styles.downloadBackground}>
    <div className="container-fluid mt-3">

  
      <div  className="row d-flex justify-content-between ">
        <div className="col-auto"> 
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
       </div>

       <div className={`card   ${styles.downloadform}`} style={{height:100}}>
          <h1 className="display-4  text-center create-title" style={{fontWeight:'bold'}}>Upload/Download</h1>
        </div>

      

      <div class="row justify-content-between">
         <div class="col-4">
          <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} />
          </div>
        <div class="col-8 d-flex  justify-content-end">
            <div >
               <button className={`btn btn-danger `} onClick={handleDeleteAllPreviews}>Remove all</button>
            </div>
           
            <div >
              <button className={`btn btn-primary`} onClick={handleDownloadAll}>Download All</button>
            </div>

            <div >
              <button className={`btn btn-success ` } onClick={handleupload}>Done</button>
           </div>
         </div>
     </div>

      <div className={`mt-3 ${styles.downloadDiv}`} style={{ display: 'flex',justifyContent: 'flex-start',alignItems: 'center'}}>
        {imagePreviews.map((preview, index) => (
         
          <span key={index} className={styles.imgPreviews}  style={{marginLeft:'10px', marginBottom:'10px'}}>
            <img  
              src={preview}
              alt={`image ${index}`}
              style={{ width: '100px', height: '120px', top: '20px',marginTop:'20px',marginLeft:'20px' ,marginBottom:'20px'}}
            />
            <button className={`btn btn-danger ${styles.downloadDelete}`}  onClick={() => handleDeleteImage(index)}>刪除</button>
            <button className={`btn btn-primary ${styles.downloadSingleImg}`}  onClick={() => handleDownload(selectedFiles[index])}>Download</button>
          </span>

      
        ))}
      </div>

    </div>
  );
}

export default Download2;