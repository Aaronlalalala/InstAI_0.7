import React, { useEffect, useState, Fragment } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import InstAI_icon from '../../image/iconnew.png'

const Register = () => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  //# register regulation verify the form of register table.
  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fname) {
      error.fname = "First Name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    return error;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
    // if (!formErrors) {
    //   setIsSubmit(true);
    // }
  };

  //# register demo
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios
        .post("http://localhost:8080/api/account/signup/", user)
        .then((res) => {
          alert(res.data);
          navigate("/login", { replace: true });
        });
    }
  }, [formErrors]);
  // web rendering for Register
  return (
    <Fragment>

  {/* <div className={registerstyle.container}> */}
  <div className="container"  style={{marginTop:"20vh"}}>

<div className="row">
  <div className="col-md-3 mx-auto"> 
    <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" ></img>
  </div>
</div>

<div className="row" >
  <div className="col-md-5  mx-auto"> 

  <div className={`card rounded-5 ${registerstyle.registercard}`}>
    <div className="card-body">
    <h3 className="card-title text-center " style={{fontWeight:'bold'}}>Sign Up</h3>
    <form>
    <label className="form-label fs-6 mt-2 mb-1 fw-bold">First name</label>
    <input
      type="text"
      name="fname"
      id="fname"
      onChange={changeHandler}
      value={user.fname}
      className="form-control fs-6  mt-1 mb-1 fw-bold"
    />
    <p className={`text-center ${basestyle.error}`}>{formErrors.fname}</p>
    <label className="form-label fs-6  mt-1 mb-1 fw-bold">Last name</label>
    <input
      type="text"
      name="lname"
      id="lname"
      onChange={changeHandler}
      value={user.lname}
      className="form-control fs-6  mt-1 mb-1 fw-bold"
    />
    <p className={`text-center ${basestyle.error}`}>{formErrors.lname}</p>
    <label className="form-label fs-6  mt-1 mb-1 fw-bold">Email</label>
    <input
      type="email"
      name="email"
      id="email"
      onChange={changeHandler}
      value={user.email}
      className="form-control fs-6  mt-1 mb-1 fw-bold"
    />
    <p className={`text-center ${basestyle.error}`}>{formErrors.email}</p>
    <label className="form-label fs-6  mt-1 mb-1 fw-bold">Password</label>
    <input
      type="password"
      name="password"
      id="password"
      onChange={changeHandler}
      value={user.password}
      className="form-control fs-6  mt-1 mb-1 fw-bold"
    />
    <p className={`text-center ${basestyle.error}`}>{formErrors.password}</p>
    <label className="form-label fs-6  mt-1 mb-1 fw-bold">Confirm password</label>
    <input
      type="password"
      name="cpassword"
      id="cpassword"
      onChange={changeHandler}
      value={user.cpassword}
      className="form-control fs-6  mt-1 mb-1 fw-bold"
    />
    <p className={`text-center ${basestyle.error}`}>{formErrors.cpassword}</p>
    <button type="button" className={`btn ${basestyle.button_common} `} onClick={signupHandler}>
      SIGN UP
    </button>
    <NavLink className={`nav-link text-center text-primary `} style={{fontWeight:'bold'}} to="/login">
      Sign in to existing account
    </NavLink>
  </form>

    </div>
  
</div>
<div className='text-center mt-3'>
  Have questions? Send email to <b>support@instai.co</b>
</div>

  </div>
</div>

</div>

    </Fragment>
  );
};
export default Register;
