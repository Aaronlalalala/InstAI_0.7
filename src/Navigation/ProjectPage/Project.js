import React, { useState, useEffect } from "react";
import "./Project.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from 'react-spinners';
import InstAI_icon from '../../image/instai_icon.png'

function Project() {
  const location = useLocation();
  const userid = localStorage.getItem("userId");
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [diffusionType , setDiffusionType] = useState();
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const g_r = process.env.REACT_APP_GET_PROJECT;
  const d_p = process.env.REACT_APP_DELETE_PROJECT;
  const [isLoading, setIsLoading] = useState(false);
  let isMounted = true; // 使用一個標誌來標記組件是否已經 mount 
  const g_s  = process.env.REACT_APP_GET_STEP;
  const g_c  = process.env.REACT_APP_GET_IMGCOUNT

  const getCount = async (projectname) => {
    try {
      const token = localStorage.getItem('jwtToken');
  
      const response = await axios.get(`${g_c}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { projectname: projectname, username: id }
      });
  
      console.log("response data is", response.data);
      if (response.data === 'error') {
        throw new Error('Error fetching data');
      }
      console.log(response.data);
      let chance = response.data.img_generation_remaining_count;  
      console.log(chance);
      return chance ; 
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // 在發送請求之前，設置isLoading為true
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${g_r}/?username=${type ? id : userid}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // 預設會有type在response.data裡面
        // console.log(response.data);
        // const combinedProjects = response.data.projectname.map((projectname, index) => ({
        //   name: projectname,
        //   desc: response.data.desc[index],
        //   // type: response.data.type[index]
        // }));
        
        setProjectList(response.data);
        console.log(response.data)
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
        
      }finally {
        setIsLoading(false); // 在接收到響應或捕獲到錯誤後，設置isLoading為false
      }
    };
    fetchData();
  }, [g_r,id,type,userid]);

  const fetchstep = async (projectname) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `${g_s}/?username=${userid}&projectname=${projectname}`, {
          headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      console.log("response data is",response.data);
      if(response.data === 'error') {
        throw new Error('Error fetching data');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const Loading = () => (
    <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <BounceLoader color={'black'} loading={isLoading} size={120} /> 
    </div>
  );
  
  const handleDeleteProject = async (projectname,index) => {
    const confirmDelete = window.confirm("確定要刪除專案?");
    if (!confirmDelete) {
      return;
    }
    
    const updatedProjects = [...projectList];
    const deletedProject = updatedProjects.splice(index, 1)[0];
    localStorage.removeItem(`${deletedProject.name}type`);
    localStorage.removeItem(`${deletedProject.name}chance`);
    localStorage.removeItem(`confirmStatusImg_${id}_${projectname}`);
    localStorage.removeItem(`confirmStatusReq_${id}_${projectname}`); 
    localStorage.removeItem(`${projectname}Base64Data-1`);
    localStorage.removeItem(`${projectname}Base64Data-2`);
    localStorage.removeItem(`${projectname}Base64Data-3`);
    localStorage.removeItem(`${projectname}Base64Data-4`);
    localStorage.removeItem(`${projectname} checkPoint`);
    localStorage.removeItem("traing name");
    localStorage.removeItem(`${projectname}prmoptData`);
    setProjectList(updatedProjects);

    try {
      //console.log(deletedProject.name);
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${d_p}/?username=${type ? id : userid}`,
        { 
          projectName: projectname
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      alert(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleNavigate = async(project) => {
    try {
      const ProjectType = project.Type
      const status = await fetchstep(project.project_name);
      const chance = await getCount(project.project_name);
      const checkPoint = localStorage.getItem(`${project.project_name} checkPoint`);
      console.log("check point is",checkPoint);
      console.log("status is",status);
      console.log("chance is",chance);
      if(ProjectType ==="Image generation") {
        if(status === "Image generation"){
          const newProjectname = project.project_name
          localStorage.setItem("traing name",newProjectname);
          //若是checkPoint存在 則跳轉到PromptInputPage避免存取到風格不同模型生成的圖種
          if (chance < 1){
            navigate(`/ImgDisplayPage`)
            return;
          }else{
            if(checkPoint){
              navigate(`/PromptInputPage`);
              return;
            }
            navigate(`/ModelSelectionPage`);
            return;
          }

          
        }else{
          // status != 0 已經到生成圖片後面的進度
          const newType = 1
          setDiffusionType(newType)
          navigate(`/Step?project=${project.project_name}`);
        }
      }else { 
        const newType =2
        setDiffusionType(newType);
        navigate(`/Step?project=${project.project_name}`);
      }
    } catch (error) {
      alert('目前遇到錯誤');
    }
  }

  const handleLogout = () => {
    //setShowLogoutPrompt(true);
    const confirmlogout = window.confirm("確定要登出嗎？");
    if (!confirmlogout) {
      return;
    }
    localStorage.removeItem('jwtToken');
    localStorage.removeItem("userId");
    localStorage.removeItem('Role');
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

  // const filteredProjects = projectList.filter(
  //   project => project.projectname.toLowerCase().includes(searchTerm.toLowerCase())
  // )
  
  
  const ProjectCard = ({ project, index, handleDeleteProject, handleNavigate }) => {
    // 檢查 localStorage 中是否存在與 project.name 相對應的值
    const isProjectInLocalStorage = localStorage.getItem(`${project.name}type`) === '1';
    // 檢查response裡面的project type 是否屬於1
    // const isProjectInLocalStorage = project.type === 1;
    // setDiffusionType(project.type); 
    const projectClass = project.Type === "Image generation" ? 'project-blue' : 'project';
    const typeCheck = isProjectInLocalStorage ? 'diffusion dataset' : "";
    return (
      <div className={`col-lg-2 col-md-3 mb-4 mt-3 ${projectClass}`} key={index}>
        <div className="project-list-grid" >
          <h2 className="project-Name fs-4 fw-bold ">{project.project_name }<p className="project-imgnum fw-semibold mt-2 " >  Including: {project.img_quantity} imgs </p></h2>
       
          <div className="projectNavLink">
          <p >Status: {project.status}</p>
          <p className="">Type: {project.Type}</p>
          <p className="project-Detial">Description: {project.project_description}<br />{typeCheck}</p>

     
          </div>
          <div className="project-Delete">
            <button className="btn deleteButton" onClick={() => handleDeleteProject(project.project_name, index)}>刪除專案</button>
          </div>
          <div className="project-Nav" style={{ marginLeft: '110px' }}>
            <button className="btn deleteButton" onClick={() => handleNavigate(project)}>進入專案</button>
            {/* <button className="btn deleteButton" onClick={() => handleNavigate(project.name,project.type)}>進入專案</button> */}
          </div> 
        </div>
      </div>
    );
  };
  
  return (

  
    <div className="container-fluid mt-3">

    <div className="row d-flex justify-content-between " >
      <div className="col-auto"> 
        <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
      </div>
      <div className="col-auto mt-4"> 
        <button  className="btn  logoutButton" onClick={handleLogout}>登出</button>
      </div>
      <div className="custom-border">

      </div>
    </div>

    <div className="row">
      <div className="col-12">
        <h1 className="mt-3" style={{fontWeight:'bold'}}>Projects</h1>
      </div>
    </div>

    <div className="row d-flex justify-content-between">
      <div className="col-auto">
       <input 
        className="form-control "
        type="text"
        placeholder="搜尋專案"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

    <div className="col-auto">
       <NavLink to={`/CreateProjectPage`}>
          <button className="btn add-project-button">新增專案</button>
       </NavLink>
    </div>
    </div>

    <div className="row ml-3" style={{ marginLeft: 3 }}>
    {isLoading ? <Loading /> : projectList.map((project, index) => <ProjectCard project={project} index={index} handleDeleteProject={handleDeleteProject} handleNavigate={handleNavigate} />)}
  </div>
    {showLogoutPrompt && (
      <div className="logout-prompt">
        <p>確定要登出嗎？</p>
        <button onClick={handleConfirmLogout}>確定</button>
        <button onClick={handleCancelLogout}>取消</button>
      </div>
    )}
  </div>
  );
}

export default Project;