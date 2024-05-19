import React, { useState,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Create.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import InstAI_icon from '../../image/instai_icon.png';

function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading , setLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const [response, setResponse] = useState(null); 
  const add_p = process.env.REACT_APP_ADD_PROJECT;
  const [formData, setFormData] = useState({
    projectName: "",
    devices: [],
    projectDescription:""
    // projectType : "img generation " "model training"
  });

  const processValue = location.state?.processValue??1; // for img geneation 
  

  const handleFormDataChange = (fieldName, value) => {
    if (fieldName === "projectDescription" && value.length > 30) {
      window.confirm("限制字數在30字內");
      value = value.substring(0, 30);
    }
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  
  
  const addProject = async () => {
    if (formData.projectName.trim() === "") {
      alert("請輸入專案名稱");
    } else {
      setLoading(true);
      console.log("Form submitted:", formData);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          `${add_p}?username=${id}`,
          {
            projectName: formData.projectName.trim(),
            projectDescription: formData.projectDescription.trim(),
          }, {
            headers: {
              'Content-Type':'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        const projectName_process2 = formData.projectName.trim();
        setResponse(response.data);    
        handleFormDataChange("projectName", "");
        handleFormDataChange("projectDescription", ""); 
        console.log(response);
        setLoading(false);
        // 導航回去
        if(processValue == 1){
          navigate(`/Project?&type=1`);
        }else{
          console.log(projectName_process2);
          navigate(`/ModelSelectionPage`,{state:{projectName_process2}})
        }   
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    }
  };
  useEffect(() => {
    if (response) {
      alert(response);
      navigate(`/Project?&type=1`);
    }
  }, [response]); 
  
  useEffect(()=>{
    console.log("loading state is ",loading);
  },[loading,setLoading,addProject]);

  return (
    <div className="container-fluid mt-3">
      
    <div  className="row d-flex justify-content-between ">
        <div className="col-auto"> 
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>

        <div className="col-auto mt-4"> 
          <NavLink to={`/Project?id=${id}&type=1`} className="projectPageLink">
          <button className="btn projectPageButton">返回專案頁面</button>
        </NavLink>
        </div>
        <div className="custom-border"></div>
    </div>
    {loading?(<>
      
      <div className="hourglass"></div>
    </>):(<>
      <div className="card col-xl-5  create-form" style={{height:550}}>
      <form onSubmit={(e) => e.preventDefault()} >
        <div>
          <h1 className="display-4  text-center create-title" style={{fontWeight:'bold'}}>Create Projects</h1>
        </div>
        <div className="createProjectName">
          
          <label className="form-label fs-6">專案名稱：</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={(e) => handleFormDataChange("projectName", e.target.value)}
            className="form-control fs-6"
          />
        </div>
        <div className="createProjectDescription">
          <label className="form-label fs-6">專案描述：</label>
          <textarea
          name="projectDescription"
          value={formData.projectDescription}
          onChange={(e) => handleFormDataChange("projectDescription", e.target.value)}
          className="form-control fs-6"
          rows="3"
          ></textarea>
        </div>
        
        <button className="btn createButton mt-3" type="button" onClick={addProject}>
          新增專案
        </button>
      </form>
    </div>
    </>)}
    
  </div>
  );
}

export default Create;