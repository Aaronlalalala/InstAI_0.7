
import React,{ useEffect } from "react";
import {  useNavigate} from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./RoleAlert.css";

export default function RoleAlert() {
    const navigate = useNavigate();
    const role = localStorage.getItem('Role');


    const handleLogout = async () => {
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

    const handleGoBack = () => {
        console.log(role)
        let backPath = "/";
        if (role === "admin_user") {
            backPath = "/AdminOverView";
        } else if (role === "normal_user") {
            backPath = "/Project?type=1";
        } else if (role === "internal_user") {
            backPath = "/InternalOverView";
      
    }  navigate(backPath);
    };

    return (

        <div className="container-fluid mt-3">

            <div className="row d-flex justify-content-between ">
                <div className="col-auto">
                    <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
                </div>

                <div className="col-auto mt-4">

                 

                </div>
                <div className="custom-border"></div>
            </div>
            {
                <div className="card col-xl-5  create-form" style={{ height: 400 }}>
                    <form>

                        <div>
                            <h1 className="display-4 text-center create-title mb-5" style={{ fontWeight: 'bold' }}>Role Alert</h1>
                        </div>
                
                        <h1 className="fs-5 fw-bold mt-3">Current Role : <span className="text-danger">{role}</span></h1>
                        <p className="fs-5 fw-bold mt-3">當前權限無法瀏覽此頁面</p>

                        <div className="btn-group">
                       
                        <button type="button" className="btn btn-warning" onClick={handleGoBack}>返回{role}總覽頁面</button>
                        <button type="button" className="btn btn-danger" onClick={handleLogout}>登出</button>
                        
                        </div>
                      
                    </form>


                </div>
            }

        </div>

    )

}