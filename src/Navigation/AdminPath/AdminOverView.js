import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./AdminPage";
import { BounceLoader } from 'react-spinners';
import { Table, Form } from "react-bootstrap";

export default function AdminOverView() {
    const navigate = useNavigate();
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);



    const handleLogout = () => {
        const confirmlogout = window.confirm("確定要登出嗎？");
        if (!confirmlogout) {
            return;
        }
        localStorage.setItem('jwtToken', false);
        console.log('註銷token');
        const token = localStorage.getItem('jwtToken');
        console.log(token);
        navigate("/");
    };

    const handleConfirmLogout = () => {
        setShowLogoutPrompt(false);
        navigate("/");
    };



    const handleCancelLogout = () => {
        setShowLogoutPrompt(false);
    };

    const handleGoSDModify = () => {
        navigate("/AdminPage");
    };

    const handleGoUserManagement = () => {
        navigate("/AdminUserManagement");
    };




    return (
        <div className="container-fluid mt-3">
            <div className="row d-flex justify-content-between">
                <div className="col-auto">
                    <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }}></img>
                </div>
                <div className="col-auto mt-4">
                    <button className="btn logoutButton" onClick={handleLogout}>登出</button>
                </div>
                <div className="custom-border"></div>
            </div>


            <div className="row">
                <div className="col-12">
                    <h1 className="mt-3" style={{ fontWeight: 'bold' }}>Admin Overview</h1>
                </div>
            </div>

    
         


            <div className="container-fluid" style={{ height: "70vh" }}>
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-sm-4 mb-3 mb-sm-0">

                        <div className="card">
                            <i className="bi bi-laptop-fill"></i>
                            <div className="card-body">
                                <h2 className="card-title fw-bold ">SD models modify</h2>
                                <p className="card-text">Modify model's info from StableDiffusion.</p>
                                <button className="btn btn-primary" onClick={handleGoSDModify}>Go Modify</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 mb-3 mb-sm-0">
                        <div className="card">
                            <i className="bi bi-people-fill"></i>
                            <div className="card-body">
                                <h2 className="card-title fw-bold">User Management</h2>
                                <p className="card-text">Modify user's info from Database.</p>
                                <button className="btn btn-primary" onClick={handleGoUserManagement}>Go Modify</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {showLogoutPrompt && (
                <div className="logout-prompt">
                    <p>確定要登出嗎？</p>
                    <button onClick={handleConfirmLogout}>確定 </button>
                    <button onClick={handleCancelLogout}>取消</button>
                </div>
            )}


        </div>
    )


}