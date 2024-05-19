
import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, NavLink, } from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./AdminControl.css";
import axios from "axios";



export default function AdminUserModify() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("userid");
    const firstname = searchParams.get("firstname");
    const lastname = searchParams.get("lastname");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const password = searchParams.get("password");
    const createtime = searchParams.get("createtime");
    const modify_user = process.env.REACT_APP_MODIFY_USER;

    const [userInfo, setUserInfo] = useState({
        firstname: firstname,
        lastname : lastname,
        email: email,
        role: role,
        password: password,
        createTime: createtime,
        userid : id
    });

    const handleRoleChange = (newRole) => {
        setUserInfo({ ...userInfo, role: newRole });
        console.log(userInfo)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            console.log(userInfo)
            const response = await axios.post(`${modify_user}`,userInfo,{
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                }
             });
         
             if (response.status === 200 && response.data === "update user's information success!") {
                alert(response.data);
                console.log(response.data)
                navigate(`/AdminUserManagement`);
            } else {
                throw new Error("修改User失敗！");
            }
        } catch (error) {
            console.error('Error removeing user:', error);
            alert("修改User失敗！");
          
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
                <div className="card col-xl-5  create-form" style={{ height: 650 }}>
                    <form onSubmit={handleSubmit} >
                        <div>
                            <h1 className="display-4 text-center create-title" style={{ fontWeight: 'bold' }}>Modify User</h1>
                        </div>
                        <div className="form-group mt-4">
                            <p className="fs-5 fw-bold">FirstName:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.firstname}  onChange={(e) => {setUserInfo({ ...userInfo, firstname: e.target.value }); console.log(`Name change to ${e.target.value}`);}}/>
                        </div>
                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Lastname:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.lastname}  onChange={(e) => {setUserInfo({ ...userInfo, lastname: e.target.value }); console.log(`Name change to ${e.target.value}`);}}/>
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
                            <button type="button" className={`btn ${userInfo.role === 'normal_user' ? 'btn-primary' : 'btn-secondary'} `} onClick={() => handleRoleChange('normal_user')}>Normal User</button>
                            <button type="button" className={`btn ${userInfo.role === 'internal_user' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleRoleChange('internal_user')}>Internal User</button>
                        </div>
                        </div>                        

                        <button type="submit" className="btn btn-primary">modify</button>
                    </form>
                </div>
            }

        </div>

    )


}