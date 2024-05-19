import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Confirm/ConfirmSTR.css'; 
import InstAI_icon from '../../image/instai_icon.png';

function Data() {
  const [reqData, setReqData] = useState({});
  const [editable, setEditable] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get('projectname');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `http://localhost:8080/api/upload/getrequirement/?username=${id}&projectname=${projectname}`, {
          headers: {
            'Content-Type':'application/json',
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

  const handleSaveButtonClick = async () => {
    try {
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
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `http://localhost:8080/api/upload/requirement/?username=${id}&projectname=${projectname}`,
        { data: updatedData }, {
          headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      

      console.log('Data updated successfully:', response.data);

      fetchData();
      setEditable(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  const handleGoBack = () => {
    const confirmed = window.confirm("Remenber to check data");
    if (!confirmed) {
      const userConfirmed = window.confirm('You have not confirmed the requirement. Are you sure you want to go back?');
      if (!userConfirmed) {
        return; 
      }
    }

    if (confirmed) {
      window.alert('See your model later');
    }

    navigate(`/Model?project=${projectname}`);
  };

  return (
    <div className="review-container">
      <div className="main-InstAI-icon">
        <img src={InstAI_icon} className="logo" alt="Your Logo" />
      </div>
      <div className="data-preview">
        <h2>Your original answer</h2>
        <div className="questions-answers">
          {reqData.Requirement1 && (
            <div className="question-answer">
              <p>Question 1: {reqData.Requirement1.question}</p>
              <p>
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
            <div className="question-answer">
              <p>Question 2: {reqData.Requirement2.question}</p>
              <p>
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
      </div>
      
      <button onClick={() => setEditable(!editable)}>{editable ? 'Cancel Edit' : 'Edit'}</button>
      {editable && <button onClick={handleSaveButtonClick}>SEND Edition</button>}
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default Data;
