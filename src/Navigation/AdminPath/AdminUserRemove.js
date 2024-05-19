
import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, NavLink, } from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./AdminControl.css";
import axios from "axios";

export default function AdminUserRemove() {
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
    const remove_user = process.env.REACT_APP_REMOVE_USER;
    const removeInfo = {userid : id }

    const [userInfo, setUserInfo] = useState({
        Name: firstname + lastname,
        Email: email,
        Role: role,
        Password: password,
        CreateTime: createtime,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            console.log(removeInfo)
            const response = await axios.post(`${remove_user}`,removeInfo,{
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                }
             });
         
             if (response.status === 200 && response.data === "已刪除此使用者所有資訊!") {
                alert(response.data);
                console.log(response.data)
                navigate(`/AdminUserManagement`);
            } else {
                throw new Error("刪除User失敗！");
            }
        } catch (error) {
            console.error('Error removeing user:', error);
            alert("刪除User失敗！");
          
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
                <div className="card col-xl-5  create-form" style={{ height: 550 }}>
                    <form  onSubmit={handleSubmit}>
                        <div>
                            <h1 className="display-4 text-center create-title" style={{ fontWeight: 'bold' }}>Remove User</h1>
                        </div>
                        <div className="form-group mt-5">
                            <p className="fs-5 fw-bold">Name:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.Name} disabled />
                        </div>
                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Email:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.Email}  disabled/>
                        </div>

                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Password:</p>
                            <input type="text" className="form-control custom-input" value={userInfo.Password}  disabled />
                        </div>
                        <div className="form-group mt-3 mb-5">
                            <p className="fs-5 fw-bold">Role:</p>
                            <div className="btn-group mb-3" role="group" aria-label="Role selection">
                                <button type="button" className={`btn ${userInfo.Role === 'normal_user' ? 'btn-primary' : 'btn-secondary'} `} disabled>Normal User</button>
                                <button type="button" className={`btn ${userInfo.Role === 'internal_user' ? 'btn-primary' : 'btn-secondary'}`} disabled>Internal User</button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">remove</button>
                    </form>
                </div>
            }

        </div>

    )

}