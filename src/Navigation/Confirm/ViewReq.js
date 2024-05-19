import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css';
import InstAI_icon from '../../image/instai_icon.png';

function ViewReq() {
  const [reqData, setReqData] = useState({});
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname');
  const id = localStorage.getItem("userId");
  const get_req = process.env.REACT_APP_GET_REQUIREMENT;
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `${get_req}/?username=${id}&projectname=${projectname}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const responseData = response.data.content;
      const parsedData = {};
      responseData.forEach(item => {
        const parsedItem = JSON.parse(`{${item}}`);
        Object.assign(parsedData, parsedItem);
      });
      setReqData(parsedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, projectname]);

  const handleGoBack = () => {
    console.log("已經檢查需求");
    navigate(`/Step?project=${projectname}`);
  };

  return (



    // <div className="review-container">
    <div className="container-fluid mt-3 p-0">

      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
      </div>

      <div className='container-fluid p-0 border-top bg-light' style={{ height: "100vh" }}>
        <div className="card col-xl-5  view-form" style={{ height: 600 }}>
          <div>
            <h1 className="display-5  mb-5 text-center create-title text-light" style={{ fontWeight: 'bold' }}>Requirement Preview</h1>
          </div>

          <div className='container bg-light border border-2 rounded-2'>
            {reqData.Requirement1 && (
              <div className='container'>
                <p className="mt-5 fs-4 fw-bold" >Question 1: <br></br>{reqData.Requirement1.question}</p>
                <p className='fs-5 fw-semibold' >
                  Answer 1:{' '}
                  {editable ? (
                    <span
                      id="editedAnswer1"
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: reqData.Requirement1.answer }}
                    ></span>
                  ) : (
                    reqData.Requirement1.answer
                  )}
                </p>
              </div>
            )}

            {reqData.Requirement2 && (
              <div className='mt-5 container' >
                <p className="mt-3 fs-4 fw-bold" style={{ fontWeight: 'bold' }}>Question 2: <br></br>{reqData.Requirement2.question}</p>
                <p className='fs-5 fw-semibold'>
                  Answer 2:{' '}
                  {editable ? (
                    <span
                      id="editedAnswer2"
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: reqData.Requirement2.answer }}
                    ></span>
                  ) : (
                    reqData.Requirement2.answer
                  )}
                </p>
              </div>
            )}

           

          </div>

          <div className="d-flex justify-content-end mt-3 mb-1 ">
              <button onClick={handleGoBack} className='btn viewButton'>Go Back</button>
            </div>




        </div>

      </div>





    </div>
  );
}

export default ViewReq;
