import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InstAI_icon from "../../image/instai_icon.png";
import { Row, Col, Navbar, Nav, Card, Container, Alert } from "react-bootstrap";
import { Table, Form } from "react-bootstrap";
import "./InternalOverView.css";
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { BounceLoader } from 'react-spinners';
import UploadImg from "../UploadImg/UploadImg";



export default function InternalOverView() {

   const navigate = useNavigate();
   const fileInputRef = useRef(null);
   const [isLoading, setIsLoading] = useState(false);
   const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
   const [selectInfo, setInfo] = useState([]);
   const [filterProject, setFilterProject] = useState('All'); // State for filtering project by status
   const get_allproject = process.env.REACT_APP_GET_ALLPROJECT;
   const download_allimgs = process.env.REACT_APP_DOWNLOAD_ALLIMGS;
   const uplopad_model = process.env.REACT_APP_UPLOAD_MODEL;
   const get_allmodel = process.env.REACT_APP_GET_SINGLEMODEL;
   const [currentPage, setCurrentPage] = useState(1);
   const [projectsPerPage] = useState(10);
   const [projects, setProjects] = useState([]);
   const [models, setModels] = useState([]);
   const baseUrl = 'https://instaiweb-bucket.s3.amazonaws.com/';
   const [isDownloading, setIsDownloading] = useState(false);
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const filterProjectByStatus = (status) => {

      if (status === 'All') {

         return projects;
      } else if (status === 'Model training in process') {

         return projects.filter(project => project.status === status);
         
      }else if (status === "Model training completed") {

         return projects.filter(project => project.status === status);
         
      }
   };


   // Get current users based on pagination
   const indexOfLastProject = currentPage * projectsPerPage;
   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
   const filteredProjects = filterProjectByStatus(filterProject); // Filter users based on selected role
   const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

   const fetchData = async () => {
      setIsLoading(true); // 在發送請求之前，設置isLoading為true
      try {
         const token = localStorage.getItem("jwtToken");
         const response = await axios.get(`${get_allproject}`, {
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
         });
         setProjects(response.data)

      } catch (error) {

      } finally {
         setIsLoading(false); // 在接收到響應或捕獲到錯誤後，設置isLoading為false
      }
   };



   const fetchModelData = async () => {
      setIsLoading(true);
      try {
         const token = localStorage.getItem("jwtToken");
         const response = await axios.get(`${get_allmodel}`, {
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
         });
         setModels(response.data);

      } catch (error) {
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };




   useEffect(() => {
      fetchData();
      fetchModelData();



   }, []);




   const handleDownload = (project) => {
      const fetchImgData = async () => {
         try {
            setIsDownloading(true);
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get(`${download_allimgs}?projectname=${project.project_name}&username=${project.userid}`, {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               }
            });
            const images = response.data.images;
            const encodedUrls = images.map(url => `${baseUrl}${encodeURIComponent(url)}`);

            const zip = new JSZip();

            // 一個儲存所有promise檔案的 promises array
            const promises = encodedUrls.map(async url => {
               const filename = url.substring(url.lastIndexOf("/") + 1);
               const file = await fetch(url);
               console.log(file)
               const fileBlob = await file.blob();
               console.log(fileBlob)
               zip.file(filename, fileBlob);
            });

            console.log(promises)
            // 等待所有文件的添加操作完成
            await Promise.all(promises);

            // 生成壓縮文件
            const zipBlob = await zip.generateAsync({ type: "blob" });

            // 下载壓縮文件
            FileSaver.saveAs(zipBlob, `${project.project_name}.zip`);

         } catch (error) {
            console.log(error);
         } finally {
            setIsDownloading(false);
         }
      };
      fetchImgData();
   }

   const handleClick = (project, index) => {
      setInfo([project.project_name, project.userid])
      fileInputRef.current.click();
      console.log(selectInfo)

   }

   const handleUpload = async () => {



      const file = fileInputRef.current.files[0];
      if (!file) {
         console.error('No file selected');
         return;
      }

      const formData = new FormData();
      formData.append('file', file);


      try {
         const token = localStorage.getItem('jwtToken');
         const response = await axios.post(
            `${uplopad_model}?username=${selectInfo[1]}&projectname=${selectInfo[0]}`,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
               }
            });
         if (response.data === "upload model success!") {
            alert("Upload model into project success.")
            fetchData();
            fetchModelData();
         } else {
            alert("Something wrong happened when uploading model")
         }
         console.log(response.data);
      } catch (error) {
         console.error('Error uploading file:', error);
      }
   };


   const handleLogout = () => {
      //setShowLogoutPrompt(true);
      const confirmlogout = window.confirm("確定要登出嗎？");
      if (!confirmlogout) {
         return;
      }
      localStorage.setItem('jwtToken', false);
      console.log('註銷token');
      //alert('註銷token');
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      navigate("/"); // Redirect to the home page
   };

   const handleConfirmLogout = () => {
      setShowLogoutPrompt(false);
      navigate("/"); // Redirect to the home page
   };

   const handleCancelLogout = () => {
      setShowLogoutPrompt(false);
   };


   const Loading = () => (
      <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
         <BounceLoader color={'black'} loading={isLoading} size={120} />
      </div>
   );



   return (
      <div className="container-fluid mt-3">

         <div className="row d-flex justify-content-between " >
            <div className="col-auto">
               <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
            </div>
            <div className="col-auto mt-4">
               <button className="btn  logoutButton" onClick={handleLogout}>登出</button>
            </div>
            <div className="custom-border">

            </div>
         </div>

         <div className="row justify-content-between mt-3">
            <div className="col-auto">
               <h1 className="mt-3" style={{ fontWeight: 'bold' }}>All Projects</h1>
            </div>

         </div>
         {isDownloading && (
            <div className="downloading">
               <p>正在下載圖片中，請稍後...</p>

            </div>
         )}

         <div className="d-flex  align-items-start">
            <div className="mb-3 ms-1  mt-4 ">

               <button type="button" className={`btn ${filterProject === 'All' ? 'btn-primary' : 'btn-secondary'}  me-2`} onClick={() => setFilterProject('All')}>All</button>
               <button type="button" className={`btn ${filterProject === 'Model training in process' ? 'btn-primary' : 'btn-secondary'} me-2 `} onClick={() => setFilterProject('Model training in process')}>Model training in process</button>
               <button type="button" className={`btn ${filterProject === 'Model training completed' ? 'btn-primary' : 'btn-secondary'} me-2 `} onClick={() => setFilterProject('Model training completed')}>Model training completed</button>
            </div>
         </div>

         {isLoading ? <Loading /> : <Table className='table table-hover table-sm mx-auto table-striped mt-3' style={{ maxWidth: "1000px" }}>

            <thead>
               <tr className='table-dark text-center align-middle'>

                  <th scope="col">UserID</th>
                  <th scope="col">Email</th>
                  <th scope='col'>ProjectID</th>
                  <th scope="col">ProjectName</th>
                  <th scope="col">ProjectDescription</th>
                  <th scope="col">Status</th>
                  <th scope="col">Type</th>
                  <th scope="col">CreateTime</th>
                  <th scope="col">ImgGenRemainingCount</th>
                  <th scope="col">DownloadAllImgs</th>
                  <th scope="col">UploadModel</th>
                  <th scope="col">ModelName</th>
               </tr>
            </thead>
            <tbody className='table-group-divider'>

               {currentProjects.map((project, index) => {
                  const matchingModel = models.find(model => model.project_id == project.id); // 使用 == 進行比較

                  return (
                     <tr className='text-center align-middle' key={index}>
                        <td className="table-dark">{project.userid}</td>
                        <td className="table-light">{project.email}</td>
                        <td className='table-light'>{project.id}</td>
                        <td className="table-light">{project.project_name}</td>
                        <td className="table-light">{project.project_description}</td>
                        <td className='table-light'>{project.status}</td>
                        <td className="table-light">{project.Type}</td>
                        <td className="table-light">{project.CreateTime}</td>
                        <td className="table-light">{project.img_generation_remaining_count}</td>
                        <td className="table-light"><button><i className="bi bi-download" onClick={() => handleDownload(project, index)} ></i></button></td>
                        <td className="table-light justify-content-center">
                           <div>
                              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={() => handleUpload(project, index)} />
                              <button onClick={() => handleClick(project, index)} disabled={project.status !== 'Model training in process'}>Select File</button>
                           </div>
                        </td>
                        <td className="table-light">{matchingModel ? matchingModel.model_name : null}</td>
                     </tr>
                  );
               })}

            </tbody>
         </Table>}


         {/* Pagination */}
         <ul className="pagination pagination-sm justify-content-center ">
            <li className="page-item">
               <button className="page-link " onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  &laquo;
               </button>
            </li>
            {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }).map((_, i) => (
               <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(i + 1)} className="page-link ">{i + 1}</button>
               </li>
            ))}
            <li className="page-item">
               <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}>
                  &raquo;
               </button>
            </li>
         </ul>


         {showLogoutPrompt && (
            <div className="logout-prompt">
               <p>確定要登出嗎？</p>
               <button onClick={handleConfirmLogout}>確定</button>
               <button onClick={handleCancelLogout}>取消</button>
            </div>
         )}
      </div>
   )
}