import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, NavLink, } from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./AdminControl.css";
import axios from "axios";
import { Row, Col, Card, Container, Nav, Navbar } from "react-bootstrap";


export default function AdminCreateUser() {
    const navigate = useNavigate();
    const sign_up = process.env.REACT_APP_SIGN_UP;
    const [userInfo, setUserInfo] = useState({
        fname: "",
        lname : "",
        email: "",
        password: "",
        role: "",

    });

    const handleRoleChange = (newRole) => {
        setUserInfo({ ...userInfo, role: newRole });
        console.log(userInfo)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(userInfo)
            const response = await axios.post(`${sign_up}`,userInfo,{
              
             });
         
             if (response.data === "register success!") {
                alert(response.data);
                console.log(response.data)
                navigate(`/AdminUserManagement`);
            } else {
                throw new Error("刪除User失敗！");
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert("創建User失敗！");
          
        }
    };

    return (

        <div className="container-fluid mt-3">

            <div className="row d-flex justify-content-between ">
                <div className="col-auto">
                    <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
                </div>

                <div className="col-auto mt-4">
                    <NavLink to={`/AdminUserManagement`} className="projectPageLink">
                        <button className="btn projectPageButton">返回使用者總覽頁面</button>
                    </NavLink>
                </div>
                <div className="custom-border"></div>
            </div>
            {
                <div className="card col-xl-5  create-form" style={{ height: 670 }}>
                    <form onSubmit={handleSubmit} >
                        <div>
                            <h1 className="display-4 text-center create-title" style={{ fontWeight: 'bold' }}>Create User</h1>
                        </div>
                        <div className="form-group mt-5">
                            <p className="fs-5 fw-bold">Firstname:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.fname}  onChange={(e) => {setUserInfo({ ...userInfo, fname: e.target.value }); console.log(`Firstname change to ${e.target.value}`);}}/>
                        </div>
                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Lastname:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.lname}  onChange={(e) => {setUserInfo({ ...userInfo, lname: e.target.value }); console.log(`Lastname change to ${e.target.value}`);}}/>
                        </div>
                        
                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Email:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.email} onChange={(e) => {setUserInfo({ ...userInfo, email: e.target.value }); console.log(`Email change to ${e.target.value}`);}} />
                        </div>
                      
                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Password:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.password} onChange={(e) => {setUserInfo({ ...userInfo, password: e.target.value }); console.log(`Password change to ${e.target.value}`);}} />
                        </div>
                        <div className="form-group mt-3 mb-5">
                            <p className="fs-5 fw-bold">Role:</p>
                            <div className="btn-group mb-3" role="group" aria-label="Role selection">
                            <button type="button" className={`btn ${userInfo.role === 'normal_user' ? 'btn-primary' : 'btn-secondary'} `} onClick={() => {handleRoleChange('normal_user'); console.log(`Role change to Normal_User`);}}>Normal User</button>
                            <button type="button" className={`btn ${userInfo.role === 'internal_user' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => {handleRoleChange('internal_user'); console.log(`Role change to Internal_User`)}}>Internal User</button>
                        </div>
                        </div>                        

                        <button type="submit" className="btn btn-primary">create</button>
                    </form>
                </div>
            }

        </div>

    )
}