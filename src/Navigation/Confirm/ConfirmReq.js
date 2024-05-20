import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css';
import InstAI_icon from '../../image/instai_icon.png';
import { BounceLoader } from 'react-spinners';

function ConfirmReq() {
  const [reqData, setReqData] = useState({});
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname');
  const id = localStorage.getItem("userId");
  const c_s = process.env.REACT_APP_CONFIRM_STEP;
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(JSON.parse(localStorage.getItem(`confirmStatusReq_${id}_${projectname}`) || 'false'));
  const [, forceUpdate] = useState();

  const get_req = process.env.REACT_APP_GET_REQUIREMENT;
  const upload_req = process.env.REACT_APP_UPLOAD_REQUIREMENT;
  // console.log('Initial confirmed value:', confirmed);
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const changeStep = async (status_now) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = { step: "Model training ready", projectname: projectname, username: id };
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

  useEffect(() => {
    localStorage.setItem(`confirmStatusReq_${id}_${projectname}`, confirmed.toString());
    fetchData();
  }, [id, projectname]);

  // 更改整合的部分
  const handleSaveButtonClick = async () => {
    const updatedData = {
      Requirement1: {
        question: reqData.Requirement1.question,
        answer: editable ? document.getElementById('editedAnswer1').innerText : reqData.Requirement1.answer,
      },
      Requirement2: {
        question: reqData.Requirement2.question,
        answer: editable ? document.getElementById('editedAnswer2').innerText : reqData.Requirement2.answer,
      },
      ID: id,
      author: '',
      LastUpdated: new Date().toLocaleString(),
    };
    const requestData = {
      method: "POST",
      request: updatedData,
      response: {
        message: "傳輸成功",
      },
    };
    // try {
    //   const token = localStorage.getItem('jwtToken');
    //   const response = await axios.post(
    //     `${upload_req}/?username=${id}&projectname=${projectname}`,
    //     requestData, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //       }
    //     }
    //   );

    //   console.log('Data updated successfully:', response.data);

     
    //   setEditable(false);
    // } catch (error) {
    //   console.error('Error updating data:', error);
    // }

    
      
    // try {
    //   const token = localStorage.getItem('jwtToken');
     
    //   const response = await axios.get(
    //     `${get_req}/?username=${id}&projectname=${projectname}`, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
    //   const responseData = response.data.content;
    //   const parsedData = {};
    //   responseData.forEach(item => {
    //     const parsedItem = JSON.parse(`{${item}}`);
    //     Object.assign(parsedData, parsedItem);
    //   });
    //   setReqData(parsedData);
    //   console.log(responseData)
    //   alert('Requirement update success!');
    //   console.log(reqData)
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `${upload_req}/?username=${id}&projectname=${projectname}`,
        requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
    
      // console.log('Data updated successfully:', response.data);
    
      setEditable(false);
    
      // 等待 5 秒後執行下一個請求
      setTimeout(async () => {
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
          // console.log(responseData);
          alert('Requirement update success!');
          // console.log(reqData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }, 3000); // 5 秒後執行
    } catch (error) {
      console.error('Error updating data:', error);
    }
    
    
  };
  // 按鈕 設定confirm狀態
  const handleConfirmButtonClick = () => {
    console.log('handleConfirmButtonClick triggered');

    if (confirmed) {
      console.log("取消確認狀態");
      handleCancelConfirmation();
      changeStep("Requirement confirmation");
    }
    else {
      console.log("確認狀態");
      handleConfirmRequirement();
      changeStep("Model training ready");
    }
  };

  const handleCancelConfirmation = () => {
    const userConfirmed = window.confirm('Are you sure you want to cancel the confirmation?');
    if (userConfirmed) {
      localStorage.setItem(`confirmStatusReq_${id}_${projectname}`, 'false');
      setConfirmed(false);
    }
  };

  const handleConfirmRequirement = () => {
    const userConfirmed = window.confirm('Are you sure you want to confirm the requirement?');
    if (userConfirmed) {
      localStorage.setItem(`confirmStatusReq_${id}_${projectname}`, 'true');
      setConfirmed(true);
    }
  };

  const handleGoBack = async () => {
    if (!confirmed) {
      const userConfirmed = window.confirm('You have not confirmed the requirement. Are you sure you want to go back?');
      if (userConfirmed) {
        navigate(`/Step?project=${projectname}`);
      } else {
        return;
      }
    }

    else {
      navigate(`/Step?project=${projectname}`);
    }
  };
  // 渲染區域
  const BounceWait = () => {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <BounceLoader color={'black'} size={120} />
      </div>
    )
  }
  const Header = () => {
    return (
      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
      </div>
    )
  }
  const Req1Card = () => {
    return (
      <div >
        <p className="mt-5 fs-4 fw-bold" style={{ fontWeight: 'bold' }}>Question 1: <br></br> {reqData.Requirement1.question}</p>
        <p className='fs-5 fw-semibold'>
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
    )
  }
  const Req2Card = () => {
    return (
      <div className="question-answer">
        <p className="mt-5 fs-4 fw-bold" style={{ fontWeight: 'bold' }}>Question 2: <br></br> {reqData.Requirement2.question}</p>
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
    )
  }
  const ConfirmButtonCard = () => {
    return (
      <div className=" d-flex mt-2 mb-3 justify-content-center ">
        <button className={confirmed ? 'btn mr-1 btn-success' : 'btn mr-1 btn-danger'}   disabled={confirmed ? true : false}onClick={handleConfirmButtonClick}  >
          {confirmed ? 'Confirmed' : 'Confirm'}
        </button>
      </div>
    )
  }
  return (
    <div className="container-fluid mt-3 p-0">

      <Header />
      {loading ? (<><div><BounceWait /></div></>) :
        (<>
          <div className='contiainer-fluid p-0 border-top bg-light' style={{ height: "100vh" }}>
            <div className="card col-xl-5  view-form" style={{ height: "600px" }}>
              <div><h1 className="display-5  mb-5 text-center create-title text-light" style={{ fontWeight: 'bold' }}>Requirement Preview</h1></div>
              <div className='container bg-light border border-2 rounded-2'>
                {reqData.Requirement1 && (<><Req1Card /></>)}
                {reqData.Requirement2 && (<><Req2Card /></>)}
                <ConfirmButtonCard />

              </div>
              <div className=" d-flex mt-3 justify-content-end ">
                {!confirmed ? <button className='btn btn-warning me-3' onClick={() => setEditable(!editable)}>{editable ? 'Cancel Edit' : 'Edit'}</button> : <></>}
                {editable && <button className='btn btn-success me-3' onClick={handleSaveButtonClick}>Save Edition</button>}
                <button className='btn confirmButton' onClick={handleGoBack}>Go Back</button>
              </div>

            </div>
          </div>


        </>)}


    </div>
  );
}

export default ConfirmReq;
