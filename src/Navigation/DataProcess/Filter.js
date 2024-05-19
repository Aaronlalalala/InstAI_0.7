import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstAI_icon from '../../image/instai_icon.png';
import styles from './Filter.css';
import { useNavigate, useLocation } from 'react-router-dom';
import barImg from '../../image/bar.png'
const Filter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get('projectname');
  const navigate = useNavigate();
  //const [format , setFormat] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [validFilesCount, setValidFilesCount] = useState(0);
  const [mode , setMode] = useState(false);
  
  //const fileInputRef = useRef(null);
  const u = process.env.REACT_APP_UPLOAD;
  const c_s = process.env.REACT_APP_CONFIRM_STEP;
  useEffect(() => {
    console.log('Selected Files:', selectedFiles.length);
  }, [selectedFiles]);

  const validateSize = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        console.log('Original Width:', img.naturalWidth);
        console.log('Original Height:', img.naturalHeight);
        resolve(img.naturalWidth === 512 && img.naturalHeight === 512);
      };
      img.onerror = function () {
        console.error('Error loading image');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event) => {
    console.log("touch");
    const files = event.target.files;
    console.log('Selected Files:', files);
    // if (mode === true ) {
    //   // 如果 mode 為 1，將所有選擇的檔案直接加入 selectedFiles
    //   const updatedSelectedFiles = [...selectedFiles, ...files.map((file) => ({
    //     file,
    //     uploadDate: new Date().toLocaleDateString(), // Adjust date format as needed
    //     uploadTime: new Date().toLocaleTimeString(), // Adjust time format as needed
    //   }))];
    //   const updatedImagePreviews = [
    //     ...imagePreviews,
    //     ...files.map((file) => URL.createObjectURL(file)),
    //   ];
    //   setSelectedFiles(updatedSelectedFiles);
    //   setImagePreviews(updatedImagePreviews);
    //   setValidFilesCount(updatedSelectedFiles.length);
    // }
    // else
    {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const filteredFiles = [...files].filter((file) =>
      allowedFileTypes.includes(file.type)
    );
    console.log('Filtered Files:', filteredFiles);
    const validatedFiles = await Promise.all(
      filteredFiles.map(async (file) => ({
        file,
        isValidSize: await validateSize(file),
      }))
    );

    const validFiles = validatedFiles.filter((file) => file.isValidSize);
    const newSimilarities = validFiles.filter((file) => {
      return (
        !selectedFiles.some(
          (existingFile) => existingFile.name === file.file.name
        ) &&
        !imagePreviews.some(
          (preview) => preview === URL.createObjectURL(file.file)
        )
      );
    });

    if (newSimilarities.length !== validFiles.length) {
      window.alert(
        `Selected ${validFiles.length} valid photos and found ${
          validFiles.length - newSimilarities.length
        } duplicate photos.`
      );
    }

    const updatedSelectedFiles = [...selectedFiles, ...newSimilarities.map((file) => ({
      file: file.file,
      uploadDate: new Date().toLocaleDateString(), // Adjust date format as needed
      uploadTime: new Date().toLocaleTimeString(), // Adjust time format as needed
    }))];
    const updatedImagePreviews = [
      ...imagePreviews,
      ...newSimilarities.map((file) => URL.createObjectURL(file.file)),
    ];

    setSelectedFiles(updatedSelectedFiles);
    setImagePreviews(updatedImagePreviews);
    setValidFilesCount(updatedSelectedFiles.length);
  }};
  
  const formatSize = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        ctx.drawImage(img, 0, 0, 512, 512);
        canvas.toBlob((blob) => {
          const formattedFile = new File([blob], file.name, { type: 'image/jpeg' });
          const previewURL = URL.createObjectURL(formattedFile);
          resolve({ formattedFile, previewURL });
        }, 'image/jpeg');
      };
      img.onerror = function () {
        console.error('Error loading image');
        resolve({ formattedFile: null, previewURL: null });
      };
      img.src = URL.createObjectURL(file);
    });
  };
  
  // const handelFormat = async (event) => {
  //   const files = event.target.files;
  //   const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  //   const filteredFiles = [...files].filter((file) =>
  //     allowedFileTypes.includes(file.type)
  //   );
  
  //   const formatedFiles = await Promise.all(
  //     filteredFiles.map(async (file) => await formatSize(file))
  //   );
  
  //   const newFormatFiles = formatedFiles.filter((file) => file.formattedFile !== null);
  
  //   const updatedSelectedFiles = [...selectedFiles, ...newFormatFiles.map((file) => file.formattedFile)];
  //   const updatedImagePreviews = [...imagePreviews, ...newFormatFiles.map((file) => file.previewURL)];
  //   console.log('format success');
  //   setSelectedFiles(updatedSelectedFiles);
  //   setImagePreviews(updatedImagePreviews);
  //   setValidFilesCount(updatedSelectedFiles.length);
  // };
  
  
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file]));
    a.setAttribute('download', file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    setValidFilesCount((prevCount) => prevCount - 1);
  };

  const handleDeleteAllPreviews = () => {
    setImagePreviews([]);
    setSelectedFiles([]);
    setValidFilesCount(0);
  };

  const handleDownloadAll = async () => {
    console.log(`download all ${selectedFiles.length} photos`);
    const allFiles = [...selectedFiles];
    const formattedFiles = await Promise.all(selectedFiles.map(async (file) => await formatSize(file)));
    const newFormatFiles = formattedFiles.filter((file) => file.formattedFile !== null);
    allFiles.push(...newFormatFiles.map((file) => file.formattedFile));

    allFiles.forEach((file, index) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([file]));
      a.setAttribute('download', file.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };
  const selectModle = () => {
    if (mode === false) {
      const confirmation = window.confirm("你想要關掉篩選模式功能並且無限制上傳圖片嗎?");
      if (confirmation) {
        setMode(true);
        // 可以將格式篩選的功能關掉，變成無限制上傳照片並且都會顯示照片
      }
    } else if (mode === true) {
      const confirmationWithFilter = window.confirm("你想要開啟篩選模式功能對上傳的照片做尺寸篩選嗎");
      if (confirmationWithFilter) {
        setMode(false);
        // 在這裡添加對篩選模式的相關邏輯
      }
    }
    console.log(mode);
  }
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('請選擇要上傳的圖片!');
    } 
    else if (selectedFiles.length < 10) {
      alert('请至少選擇10張合格的照片!');
      return;
    }
    else {
      const confirmDelete = window.confirm('要求已經滿足,確定要上傳圖片?');
      if (!confirmDelete) {
        return;
      }
      const uploaded = [...selectedFiles];
      const formData = new FormData();
      uploaded.forEach((file) => {
        formData.append('file', file);
      });

      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          `${u}?username=${id}&projectname=${projectname}`,
          formData, {
            headers: {
              'Content-Type':'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        
        console.log(response.data);
        alert('upload success');
        
        const response2 = await axios.post(
          `${c_s}/?step=1&username=${id}&projectname=${projectname}`, // URL，包含查詢參數
          {}, // 空的請求主體
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log('step updated successfully:', response2.data);
        

        // const response2 = await axios.post(
        //   `${c_s}/?step=1&username=${id}&projectname=${projectname}`, {
        //     headers: {
        //       'Content-Type':'application/json',
        //       'Authorization': `Bearer ${token}`
        //     }
        //   });
        console.log('step updated successfully:', response2.data);
        navigate(`/LabelPage?project=${projectname}`);
      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    }
  };

  
  return (
    <div className="container-fluid mt-3">
      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img
            src={InstAI_icon}
            className="img-fluid"
            alt="InstAi_Icon"
            style={{ width: '76.8px', height: '76.8px' }}
          />
        </div>
        <div className="custom-border"></div>
      </div>

      <div className={`card   ${styles.downloadform}`} style={{ height: 100 }}>
        <h1 className="display-4  text-center create-title" style={{ fontWeight: 'bold' }}>
          Filter the data you want
        </h1>
      </div>

      <div className="row justify-content-between">
        <div className="col-4">
        <label className="btn btn-primary">
          select image
          <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} style={{ display: 'none' }} />
        </label>  
        </div>
        <div className="col-4 d-flex  justify-content-end">
          <div>
            <button className={'btn btn-primary'} onClick={selectModle}>
              Select modes
            </button>
          </div>
          <div>
            <button className={`btn btn-danger `} onClick={handleDeleteAllPreviews}>
              Remove all
            </button>
          </div>
          <div>
            <button className={`btn btn-primary`} onClick={handleDownloadAll}>
              Download All
            </button>
          </div>
          <div>
            <button className={`btn btn-success `} onClick={handleUpload}>
              Done
            </button>
          </div>
          
        </div>
      </div>

      <div className="mt-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
         style={{
           display: "flex",
           flexDirection: "row",
           justifyContent: "space-around",
           alignItems: "center",
           width: "100%",
           marginBottom: "2px",
           padding: "5px",
           border: "1px solid black",
         }}
       >
       <p>img id</p>
       <p>labeled</p>
       <p>img height</p>
       <p>img width</p>
       <p>delete</p>
       <p>file</p>
     </div>       
     {imagePreviews.map((preview, index) => (
    <div
    key={index}
    className="image-previews-wrapper"
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: "2px",
      padding: "5px",
      border: "1px solid black",
    }}
  > 
      {/* Information */}
      <div className="d-flex flex-row align-items-center" >
        <p style={{marginLeft:'120px'}}>{index + 1}</p>
        <p style={{marginLeft:'220px'}}>{selectedFiles[index].isTagged ? 'Yes' : 'No'}</p>
        <p style={{marginLeft:'230px'}}>512</p>
        <p style={{marginLeft:'250px'}}>512</p>
         <button
          className="btn btn-danger"
          onClick={handleDeleteImage}
          style={{marginLeft:'200px'}}>
          Delete
        </button>
      </div>
      {/* Image */}
      <img
        src={preview}
        alt={`image ${index}`}
        style={{ width: '100px', height: '120px', marginRight: '50px' }}
        loading='lazy'
      />
    </div>
))}
</div>


      
    </div>
  );
};

export default Filter;
