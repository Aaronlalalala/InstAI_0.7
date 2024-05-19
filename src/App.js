import './App.css';
import {BrowserRouter as Router , Routes , Route , useNavigate , useLocation, Navigate} from "react-router-dom";
import React , {lazy, Suspense , useState , useEffect} from "react";
import { BounceLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode'

//使用 WebSocket 的網址向 Server 開啟連結
let ws = new WebSocket('ws://localhost:8080')
//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = () => {
    console.log('open connection')
}
//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}
//接收 Server 發送的訊息
ws.onmessage = event => {
  console.log(event)
}
// 開發完成頁面
// import Loading from './loading';
const Register = lazy(() => import("./Navigation/Register/Register"));
const Login = lazy(() => import("./Navigation/Login/Login"));
const DataFilter = lazy(() => import("./Navigation/DataProcess/Filter"));
const Project = lazy(() => import("./Navigation/ProjectPage/Project"));
const CreatePage = lazy(() => import("./Navigation/CreatePage/Create"));
const StepPage = lazy(() => import("./Navigation/Step1/Step"));
const ConfirmImg = lazy(() => import('./Navigation/Confirm/ConfirmIMG'));
const ConfirmReq = lazy(() => import('./Navigation/Confirm/ConfirmReq'));
const ViewReq = lazy(() => import('./Navigation/Confirm/ViewReq'));
const ViewData = lazy(() => import('./Navigation/Confirm/ViewData'));
const Requirement = lazy(() => import('./Navigation/Requirment/Requirment'));
const Data = lazy(() => import("./Navigation/ModelTrain/Data"));
const Req = lazy(() => import('./Navigation/ModelTrain/Req'));
const Model = lazy(() => import('./Navigation/ModelTrain/Model'));
const UploadImg = lazy(() => import('./Navigation/UploadImg/UploadImg'));
const CreateProjectPage = lazy(()=>import('./Navigation/CreateProjectPage/CreateProjectPage'));
const ModelSelectionPage = lazy(() => import("./Navigation/ModelSelectionPage/ModelSelectionPage"));
const PromptInputPage = lazy(() => import("./Navigation/PromptInputPage/PromptInputPage"));
const ImageDisplay = lazy(() => import("./Navigation/ImgDisplayPage/ImgDisplayPage"));
const Txt2ImgPage = lazy(() => import("./StableDiffusion/txt2txt/TXTtoIMG"));
const RoleAlert =   lazy(() => import(`./Navigation/AlertComponent/RoleAlert`));



const AdminPage = lazy(() => import(`./Navigation/AdminPath/AdminPage`));
const AdminControl = lazy(() => import(`./Navigation/AdminPath/AdminControl`));
const AdminUserManagement = lazy(() => import(`./Navigation/AdminPath/AdminUserManagement`));
const AdminUserModify = lazy(() => import(`./Navigation/AdminPath/AdminUserModify`));
const AdminUserRemove = lazy(() => import(`./Navigation/AdminPath/AdminUserRemove`));
const AdminOverView = lazy(() => import(`./Navigation/AdminPath/AdminOverView`));
const AdminCreateUser =   lazy(() => import(`./Navigation/AdminPath/AdminCreateUser`));

const InternalOverView = lazy(() => import(`./Navigation/InternalUserPath/InternalOverView`))

const Alert = lazy(() => import("./Navigation/AlertComponent/Reminder"));
const Confirm = lazy(() =>import("./Navigation/AlertComponent/Confirm"));

function AppDev() {
  const setUserState= useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role , setRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem('Role');
    if(token && token !== 'false' ){
      //檢查TOKEN是否為base64字串
      const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      if (base64Regex.test(token)) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = localStorage.setItem("userId",payload.user);
        const id_test = localStorage.getItem("id_test");
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if(userId !== id_test || userId !== id){
          navigate(location.pathname);  
        }
      } else {
        // console.error('Invalid token');
        // console.log('天俊學長別走QAQ');
      }
    }
    if (token && token !== 'false' && userRole) {
      setIsLoggedIn(true);
      setRole(userRole)
      // console.log(role)


    } else {
      setIsLoggedIn(false);
      if (location.pathname !== "/Login" && location.pathname !== "/" && isLoggedIn !== true ) {
        navigate("/Login"); 
      }
    }
  // // 判斷是Admin
  // const isAdmin = // 

  // if (isAdmin && location.pathname !== "/AdminPage") {
  //   navigate("/AdminPage");
  // } else if (!isAdmin && location.pathname === "/AdminPage") {
  //   navigate("/login"); 
  // }
  // // 


  }, [navigate, location, isLoggedIn]);

  
  return (
    <div className="App">
      
        <Suspense fallback={ 
    <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <BounceLoader color={'#black'} size={120} /> 
     </div>}>
      
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Register />} />
                <Route path='/Login' element={<Login setUserState={setUserState} />} />
                <Route path='/DataFilter' element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<DataFilter />} />
                <Route path="/Project" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Project />} />
                <Route path="/CreatePage" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<CreatePage />} />
                <Route path='/Step' element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<StepPage />} />
                <Route path="/ConfirmImg" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<ConfirmImg />} />
                <Route path="/ConfirmReq" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<ConfirmReq />} />
                <Route path="/Data" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Data />} />
                <Route path="/Req" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Req />} /> 
                <Route path="/ViewData" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<ViewData />} />
                <Route path="/ViewReq" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<ViewReq />} />
                <Route path="/Model" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Model />} />
                <Route path="/Requirment" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Requirement />} />
                <Route path='/UploadImg' element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<UploadImg/>}/>
                <Route path="/CreateProjectPage" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<CreateProjectPage/>}/>
                <Route path="/ModelSelectionPage" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<ModelSelectionPage/>}/>
                <Route path="/PromptInputPage" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<PromptInputPage/>}/>
                <Route path ="/ImgDisplayPage" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<ImageDisplay/>}/>
                <Route path ="/Txt2ImgPage" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Txt2ImgPage/>}/>
                <Route path="/Alert" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Alert/>}/>
                <Route path="/Confirm" element={role !== 'normal_user' ? <Navigate to="/RoleAlert" /> :<Confirm/>}/>
                <Route path="/AdminPage" element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminPage />}/>
                <Route path="/AdminControl" element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminControl/>}/>
                <Route path="/AdminUserManagement" element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminUserManagement/>}/>
                <Route path="/AdminUserModify" element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminUserModify/>}/>
                <Route path="/AdminUserRemove"element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminUserRemove/>}/>
                <Route path="/AdminOverView" element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminOverView/>}/>
                <Route path="/AdminCreateUser" element={role !== 'admin_user' ? <Navigate to="/RoleAlert" /> : <AdminCreateUser/>}/>
                <Route path="/InternalOverView" element={role !== 'internal_user'  ? <Navigate to="/RoleAlert" /> : <InternalOverView/>}/>
                <Route path="/RoleAlert" element={ <RoleAlert/>}/>

              </>
            ) : (
              <>
                <Route path="/" element={<Register />} />
                <Route path='/Login' element={<Login setUserState={setUserState} />} />
                <Route path="/RoleAlert" element={ <RoleAlert/>}/>
              </>
            )}
          </Routes>
          
        </Suspense>
      
    </div>
  );
}

function App(){
  return(
    <Router>
      <AppDev/>
    </Router>
  )
}

export default App;