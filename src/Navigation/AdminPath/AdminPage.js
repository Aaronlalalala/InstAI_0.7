import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InstAI_icon from "../../image/instai_icon.png";
import { Row, Col, Navbar, Nav, Card, Container } from "react-bootstrap";
import Adminpage_style from "./AdminPage.css";
import "./AdminPage.css";

import { BounceLoader } from 'react-spinners';



export default function AdminPage() {

   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);
   const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
   const get_model = process.env.REACT_APP_MODEL_GET;
   const [models, setModels] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true); // 在發送請求之前，設置isLoading為true
         try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get(`${get_model}`, {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               }
            });
            setModels(response.data)
            console.log(response.data);
            console.log(models);
         } catch (error) {

         } finally {
            setIsLoading(false); // 在接收到響應或捕獲到錯誤後，設置isLoading為false
         }
      };
      fetchData();
   }, []);



   const handleModifyModel = (model, index) => {
      const { checkpoint, model_name, description, model_styleimg_base64 } = model;
      const queryParams = `checkpoint=${checkpoint}&model_name=${model_name}&description=${description}&model_styleimg_base64=${model_styleimg_base64}`;
      console.log("hello")
      console.log(model)
      navigate(`/AdminControl?${queryParams}`);
   }

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

   const ModelCard = ({ models, handleModifyModel }) => (
      <div className="row justify-content-center mt-3">
         {models.map((model, index) => (
            <div key={index} className="col-md-6">
               <div className="card mb-3 ">
                  <div className="row g-0">
                     <div className="col-md-4">
                        <img src={model.model_styleimg_base64} className="img-fluid rounded-start cardimg" alt={model.checkpoint} />
                     </div>
                     <div className="col-md-8">
                        <div className="card-body">
                           <h4 className="card-title fw-bold">{model.checkpoint}</h4>
                           <h5 className="card-text fw-semibold mt-2">{model.model_name}</h5>
                           <p className="card-text fs-5">{model.description}</p>
                           <button className="btn btn-primary btn-lg mt-5" onClick={() => handleModifyModel(model, index)}>修改模型</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );

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
               <h1 className="mt-3" style={{ fontWeight: 'bold' }}>Models</h1>
            </div>

            <div className='col-auto'>
               <NavLink to={`/AdminOverview`} className="projectPageLink">
                  <button className="btn add-project-button">返回Admin總覽頁面</button>
               </NavLink>
            </div>
         </div>

         {/* <div className="row d-flex justify-content-between">
            <div className="col-auto">
               <input
                  className="form-control "
                  type="text"
                  placeholder="搜尋模型"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
         </div> */}



         <div className="row ml-3" style={{ marginLeft: 3 }}>
            {isLoading ? <Loading /> : <ModelCard models={models} handleModifyModel={handleModifyModel} />}
         </div>
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