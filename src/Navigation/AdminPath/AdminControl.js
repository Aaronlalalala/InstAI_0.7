
import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate, NavLink, } from "react-router-dom";
import InstAI_icon from "../../image/instai_icon.png";
import "./AdminControl.css";
import axios from "axios";

export default function AdminControl() {

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const checkpoint = searchParams.get("checkpoint");
    const model_name = searchParams.get("model_name");
    const description = searchParams.get("description");
    const model_styleimg_base64 = searchParams.get("model_styleimg_base64");
    const modify_model = process.env.REACT_APP_MODEL_MODIFY;
    const [modelInfo, setModelInfo] = useState({
        checkpoint: checkpoint,
        modelname: model_name,
        description: description,
        base64: model_styleimg_base64,
    });



    useEffect(() => {
        console.log("Checkpoint:", checkpoint);
        console.log("Model Name:", model_name);
        console.log("Description:", description);
        console.log("Base64:", model_styleimg_base64);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            console.log(modelInfo)
            const response = await axios.post(`${modify_model}`,modelInfo,{
                headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                }
             });
         
             if (response.status === 200 && response.data === "update SDmodel information success!") {
                alert(response.data);
                navigate(`/AdminPage`);
            } else {
                throw new Error("更新Model info失敗！");
            }
        } catch (error) {
            console.error('Error modifying model:', error);
            alert("更新Model info失敗！");
          
        }
    };



    return (

        <div className="container-fluid mt-3">

            <div className="row d-flex justify-content-between ">
                <div className="col-auto">
                    <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
                </div>

                <div className="col-auto mt-4">
                    <NavLink to={`/AdminPage`} className="projectPageLink">
                        <button className="btn projectPageButton">返回模型總覽頁面</button>
                    </NavLink>
                </div>
                <div className="custom-border"></div>
            </div>
            {
                <div className="card col-xl-5  create-form" style={{ height: 575 }}>
                    <form onSubmit={handleSubmit} >
                        <div>
                            <h1 className="display-4 text-center create-title" style={{ fontWeight: 'bold' }}>Modify model</h1>
                        </div>
                        <div className="form-group mt-5">
                            <p className="fs-5 fw-bold">Checkpoint:</p>
                            <input type="text" className="form-control custom-input" value={modelInfo.checkpoint} disabled />
                        </div>
                        <div className="form-group mt-3">
                            <p className="fs-5 fw-bold">Model Name:</p>
                            <input type="text" className="form-control custom-input" value={modelInfo.modelname} onChange={(e) => {setModelInfo({ ...modelInfo, modelname: e.target.value }); console.log(`model name change to ${e.target.value}`);}} />
                        </div>
                        <div className="form-group mt-3 ">
                            <p className="fs-5 fw-bold">Description:</p>
                            <input type="text" className="form-control custom-input" value={modelInfo.description} onChange={(e) => {setModelInfo({ ...modelInfo, description: e.target.value }); console.log(`model descrption change to ${e.target.value}`);}} />
                        </div>
                        <div className="form-group mt-3 mb-5">
                            <p className="fs-5 fw-bold">Base64:</p>
                            <input type="text" className="form-control custom-input" value={modelInfo.base64} onChange={(e) => {setModelInfo({ ...modelInfo, base64: e.target.value }); console.log(`model base64 change to ${e.target.value}`);}} />
                        </div>

                        <button type="submit" className="btn btn-primary mt-3">submit</button>
                    </form>
                </div>
            }

        </div>

    )
}