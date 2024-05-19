
import React, { useState, useEffect } from "react";
import axios from "axios";
import Prompt from "../../Components/Prompt/Prompt2";
import { useNavigate, useLocation } from "react-router-dom";
import "./Requirment.css";
import InstAI_icon from "../../image/instai_icon.png";
//import ReviewReq from "../Review/ReviewReq";

function Requirement() {
  const [reqData, setReqData] = useState({
    Requirement1: {
      question: "What is the type of location/environment that the AI model will be used?",
      answer: "",
    },
    Requirement2: {
      question: "What is the type of location/environment that the AI model will be used?",
      answer: "",
    },
    ID: "",
    author: "",
    LastUpdated: "",
  });
  const navigate = useNavigate();
  //const [ReqPreviews, setReqPreviews] = useState([]);
  const [linktostep, setlinktostep] = useState(false);
  const [isDataChecked, setIsDataChecked] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get("projectname");
  const u_r = process.env.REACT_APP_UPLOAD_REQUIREMENT;
  const c_s = process.env.REACT_APP_CONFIRM_STEP;
  // Set initial values for ID, author, and LastUpdated

  useEffect(() => {
    setReqData((prevData) => ({
      ...prevData,
      ID: projectname || "default_id",
      author: id || "default_user_id",
      LastUpdated: new Date().toLocaleString(),
    }));
  }, [id]);

  const handleFormDataChange = (fieldName, value) => {
    setReqData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    if (fieldName !== "") {
      setlinktostep(true);
    }
    console.log(`Field ${fieldName} updated to:`, value);
  };

  const handleGenerateClick = async () => {
    const answer1Length = reqData.Requirement1.answer.trim().length;
    const answer2Length = reqData.Requirement2.answer.trim().length;
    if (answer1Length === 0 || answer2Length === 0) {
      alert("Please answer both questions.");
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to submit?`);
      if (confirmed) {
        setIsDataChecked(true);
      }
    }
  };
  // 修改狀態 2變成3
  const changeStep = async (status_now) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = { step: status_now, projectname: projectname, username: id };
      const response = await axios.post(
        `${c_s}`, formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleSendData = async () => {
    const requestData = {
      method: "POST",
      request: reqData,
      response: {
        message: "傳輸成功",
      },
    };
    try {
      const token = localStorage.getItem('jwtToken');
      changeStep("Image Confirmation");
  
      const response = await axios.post(
        `${u_r}/?username=${id}&projectname=${projectname}`,
        requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("server response:", response.data);
      const formData = {step:"Image Confirmation", projectname : projectname, username: id}; 
      const response2 = await axios.post(
        `${c_s}`,formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      console.log('step updated successfully:', response2.data);
      alert("Requirement submitted successfully!");
      // Reset form data
      setReqData({
        Requirement1: {
          question: "What is the type of location/environment that the AI model will be used?",
          answer: "",
        },
        Requirement2: {
          question: "What is the main purpose for this AI model?",
          answer: "",
        },
        ID: "",
        author: "",
        LastUpdated: "",
      });
      setlinktostep(false);
      setIsDataChecked(false);
      localStorage.setItem(`secondPage_${id}_${projectname}`, 'true');
      //navigate 
      navigate(`/Step?project=${projectname}`);
    } catch (error) {
      console.error("Submission failed:", error);
      changeStep("Requirement filling");
      alert(`Submission failed, status code: ${error.response.status}`);
    }
  };

  return (
    <div className="container-fluid mt-3">

      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
      </div>

      <div className="card col-xl-5  requirement-form" style={{ height: 700 }}>
        <div>
          <h1 className="display-4 mt-1 mb-5 text-center create-title text-light" style={{ fontWeight: 'bold' }}>Requirement</h1>
        </div>

        <div className="container bg-light border border-2 rounded-2">
          <p className="mt-4 fs-4 fw-bold" style={{ fontWeight: 'bold' }}>Question1</p>
          <p className="mt-2 fs-5 fw-semibold">What is the type of location/environment that the AI model will be used?</p>
          <div className="prompt">
            <Prompt
              text={reqData.Requirement1.question}
              value={reqData.Requirement1.answer}
              onChange={(value) => handleFormDataChange("Requirement1", { ...reqData.Requirement1, answer: value })}
            />
          </div>

          <p className="mt-3 fs-4 fw-bold" style={{ fontWeight: 'bold' }}>Question2</p>
          <p className="mt-2 fs-5 fw-semibold">What is the main purpose for this AI model?</p>
          <div className="prompt">
            <Prompt
              text={reqData.Requirement2.question}
              value={reqData.Requirement2.answer}
              onChange={(value) => handleFormDataChange("Requirement2", { ...reqData.Requirement2, answer: value })}
            />
          </div>

       
        </div>

        <div className="container mt-4">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end ">
                {isDataChecked ? (
                  <>
                    {/* {linktostep ? (
            <NavLink to={`/Step?id=${id}&project=${projectname}`}>
              <button onClick={handleSendData} className="btn submitButton">
                Submit
              </button>
            </NavLink>
               ) : (
            <button onClick={handleSendData} className="btn submitButton">
              Submit
            </button>
             )} */}
                    <button onClick={handleSendData} className="btn btn-lg submitButton mb-2 ">
                      Submit
                    </button>
                  </>
                ) : (
                  <button onClick={handleGenerateClick} className="btn btn-lg submitButton mb-2">
                    Generate and Check
                  </button>
                )}
              </div>
            </div>
          </div>

      </div>


    </div>
  );
}

export default Requirement;
