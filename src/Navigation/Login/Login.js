import React, { useState,  Fragment , useEffect} from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import InstAI_icon from '../../image/iconnew.png'
import { jwtDecode } from 'jwt-decode'
import MeteorShower from "./MeteorShower";
import backgroundImg from "../../image/background.jpg";

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const log_in = process.env.REACT_APP_LOG_IN;
  const admin_password = process.env.REACT_APP_PASSWORD;
  const admin_email = process.env.REACT_APP_EMAIL;
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [decodedToken, setDecodedToken] = useState();

  useEffect(() => {
    if (isSubmit && Object.keys(formErrors).length === 0) {
      const login = async () => {
        try {
          const response = await axios.post(log_in, user);
          // console.log(JSON.stringify(response.data));
          if (response.data &&  response.data=== "Failed") {
            alert("登錄失敗！");
            setIsSubmit(false);
          } 
            else if (response.data.message && response.data.message === "Admin Success") {
              alert("Admin登錄成功！");
              const token = response.data.token;
              localStorage.setItem("jwtToken", token);
              const decoded = jwtDecode(token);
              setDecodedToken(decoded)
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              const remove = "Success";
              const id = response.data.message.replace(remove, "");
              // console.log(decoded);
              localStorage.setItem("Role", decoded.role);
              console.log("Admin login detected!");
              navigate("/AdminOverView", { state: id});

            }
            else {
              alert("登錄成功！");
              const token = response.data.token;
              // console.log (response.data)
              localStorage.setItem("jwtToken", token);
              const decoded = jwtDecode(token);
              setDecodedToken(decoded)
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              const remove = "Success";
              const id = response.data.message.replace(remove, "");
              const payload = JSON.parse(atob(token.split('.')[1]));
              const userId = localStorage.setItem("userId",payload.user);
              // console.log(decoded);
              localStorage.setItem("Role", decoded.role);
                console.log("Regular user login detected!");
             
                const userRole = localStorage.getItem('Role');
                console.log(userRole)
                if(userRole === "normal_user")
                { navigate("/Project", { state: id});}
                else if(userRole === "internal_user")
                {navigate("/InternalOverView", { state: id });}
               
              
            }
           
        } catch (error) {
          console.error('登錄時出錯', error);
          setIsSubmit(false);
        }
      };
      login();
    }
  }, [isSubmit]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required for login";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required for login";
    }
    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
  };
  

  return (
    <div style={{
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      height: '100vh',
      width: '100vw',
      position: 'fixed', // 修改為 fixed 以固定背景
      overflow: 'hidden' // 添加此行以禁止滾動
    }}>
  <MeteorShower />
    <React.Fragment>    
     <div className="container"  style={{marginTop:"30vh"}}>
     <div className="row">
          <div className="col-md-5 mx-auto">
            <div className={`card rounded-5 ${loginstyle.logincard}`}>
              <div className="text-center">
              <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '150px', height: 'auto' }}></img>

              </div>
              <div className="card-body">
          <h3 className="card-title text-center" style={{ fontWeight: 'bold' }}>Sign in</h3>
          <form onSubmit={loginHandler}>
           <label className="form-label fs-6 mt-2 mb-1 fw-bold">Email</label>
           <input
             type="email"
             name="email"
             id="email"
             onChange={changeHandler}
             value={user.email}
             className="form-control fs-6  mt-1 mb-1"
           />
           <p className={`text-center ${basestyle.error}`}>{formErrors.email}</p>
           <label className="form-label fs-6  mt-1 mb-1 fw-bold">Password</label>
           <input
             type="password"
             name="password"
             id="password"
             onChange={changeHandler}
             value={user.password}
             className="form-control fs-6  mt-1 mb-1"
           />
           <p className={`text-center ${basestyle.error}`}>{formErrors.password}</p>
           <button type="submit" className={`btn ${basestyle.button_common}`}>
             SIGN IN
           </button>
           <NavLink className={`nav-link text-center text-primary `} style={{fontWeight:'bold'}} to="/">
             Create a new account
           </NavLink>
         </form>
            </div>
            </div>
            <div className="text-center mt-3 " style={{ color: 'white' }}>
              Have questions? Send email to <b>support@instai.co</b>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
    </div>
  );

};

export default Login;