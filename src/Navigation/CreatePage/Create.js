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
  const c_s = process.env.REACT_APP_CONFIRM_STEP;
  const type = searchParams.get("type");
  const [projectList, setProjectList] = useState([]);
  let isMounted = true; // 使用一個標誌來標記組件是否已經 mount 

  const type_project = location.state.typeOfProject;
  const typeString = type_project === 2 ? "AI Model training" : "Image generation";
  console.log("project type is",type_project);
  console.log("project type string is ", typeString)

  const [formData, setFormData] = useState({
    projectName: "",
    devices: [],
    projectDescription:"",
    type: typeString // 增加類別判斷 => 用做project card顏色分辨 => 延伸用於status建構的不同以及圖像skip用途
    
  });
 
  const g_r = process.env.REACT_APP_GET_PROJECT;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${g_r}/?username=${type ? id : id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // // 預設會有type在response.data裡面
        // // console.log(response.data);
        //  const combinedProjects = response.data.projectname.map((projectname, index) => ({
        //   name: projectname,
        //   desc: response.data.desc[index],
        //   // type: response.data.type[index]
        // }));
        
        setProjectList(response.data);
      } catch (error) {
        if (error.response.status === 403) {
          if (isMounted) {
            isMounted = false; // 在第一次執行後將標誌設置為false，以防止後續執行
            console.error('獲取數據時出錯', error);
            alert("Timed out, please log in again!");
            navigate("/");
          } else {
            console.error('獲取數據時出錯', error);
          }

        } else {
          console.error("An error occurred:", error);
        }
        
      }
    };
    fetchData();
  }, [g_r,id,type]);

  
  const handleFormDataChange = (fieldName, value) => {
    if (fieldName === "projectDescription" && value.length > 50) {
      window.confirm("限制字數在50字內");
      value = value.substring(0, 50);
    }
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const changeStep = async (status_now , projectname) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = { step: status_now, projectname: projectname, username: id };
      const response = await axios.post(
        `${c_s}`, formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const addProject = async () => {
    
    if (formData.projectName.trim() === "") {
      alert("請輸入專案名稱");
    } else {
      const existingProject = projectList.find(project => project.project_name === formData.projectName.trim());
      if (existingProject) {
        alert("已經有相同的專案名稱了，請改名");
        return;
      }
      setLoading(true);
      console.log("Form submitted:", formData);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          `${add_p}?username=${id}`,
          {
            projectName: formData.projectName.trim(),
            projectDescription: formData.projectDescription.trim(),
            type: formData.type.trim()
          }, {
            headers: {
              'Content-Type':'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        let projectName = formData.projectName.trim();
        setResponse(response.data);    
        handleFormDataChange("projectName", "");
        handleFormDataChange("projectDescription", ""); 
        console.log(response);
        setLoading(false);
        // 導航回去
        if(type_project == 2){
          await changeStep("Image upload",projectName);
          localStorage.setItem(`${projectName}type`,2);
          navigate(`/Project?&type=1`);
          return ;
        }else{
          console.log(projectName);
          localStorage.setItem(`${projectName}type`,1);
          navigate(`/Project?&type=1`);
          return ;
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
    // console.log("loading state is ",loading);
    // console.log("天俊學長想檢查喔?")
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
