import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios"
import InstAI_icon from "../../image/instai_icon.png";
import { Navbar, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
//圖像生成部分根據後端提供之Base64資訊來顯示生成圖片，而非透過前端暫存

import { BounceLoader } from 'react-spinners';

export default function ModelStyle() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  const p = process.env;
  const modelSelect = p.REACT_APP_MODEL_SELECT;
  const get_model = p.REACT_APP_MODEL_GET;
  const projectName = localStorage.getItem("traing name");
  // console.log("traing name is",projectName,"  id is",id);
  const [errorLoading , setErrorLoading] = useState(false); 
  const [modelImgs, setModelImgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [models, setModels] = useState([]);

  const Loading = () => (
    <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <BounceLoader color={'black'} loading={isLoading} size={120} />
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // 在發送請求之前，設置isLoading為true
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${get_model}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log(response.data);
        setModels(response.data)
        const base64Imgs = response.data.map(item => item.model_styleimg_base64);
        setModelImgs(base64Imgs);
        setIsLoading(false); //
        // console.log(response.data);
        // console.log(models);
      } catch (error) {
        setErrorLoading(true);
        console.log("error detected !");
      }
    };
    fetchData();
  }, []);

  const ModelCard = ({ models, handleModifyModel, }) => (

    models.map((model, index) => (


      <Col md={3} className="mb-4">
        <div style={{ cursor: 'pointer' }} onClick={() => handleModelClick(model.model_name)}>
          <Card  >
          <Card.Img variant="top" src={modelImgs[index]} loading="lazy" style={{ width: '100%', height: '75%' }} />
            <Card.Body>
              <div className="d-flex justify-content-center" style={{ margin: 'auto' }}>
                <Button style={{ width: '80%', backgroundColor: 'black' }} onClick={() => handleModelSelect(model)}>
                  {model.model_name}
                </Button>
              </div>
              <Card.Text style={{ marginTop: '10px' }}>{model.description}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
    ))
  );

  const handleModelSelect = (model_info) => {
    const model = model_info.checkpoint
    localStorage.setItem(`${projectName} checkPoint`,model);
    navigate(`/PromptInputPage`);
  }

  const handleModelClick = (modelKey) => {
    // 記錄數值

    const value = modelKey; // 設定使用甚麼model
    // console.log(value);
    const formData = new FormData();
    formData.append('modelKey', modelKey);
    formData.append('value', value);
    const response = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(`${modelSelect}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log(response.data);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
      console.log(response.data);
    }
  };
  return (
    <div style={{ backgroundColor: 'white' }}>
      <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
          <div className="col-auto mt-4">
            <NavLink to={`/Project?&type=1`} className="CreateProjectPageLink">
              <button className="btn createprojectPageButton" style={{ marginLeft: "10px", fontFamily: 'Lato' }}>
                <h3 style={{ marginLeft: "0px" }}>Back and save the progress</h3>
              </button>
            </NavLink>

          </div>
          {/* <h3>Back</h3> */}
        </Nav>
        <Navbar.Brand href="#home" className="mx-auto">
          <img
            src={InstAI_icon}
            width="60"
            height="60"
            className="d-inline-block align-top"
            alt="InstAI logo"
          />
          {' '}InstAI
        </Navbar.Brand>
      </Navbar>
      <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '80rem', margin: '50px auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
        {errorLoading ? <h2 className="text-center mb-4" style={{ marginLeft: "10px", fontFamily: 'Lato', fontStyle: 'normal' }}>Error fetching </h2> :
         <h2 className="text-center mb-4" style={{ marginLeft: "10px", fontFamily: 'Lato', fontStyle: 'normal' }}>What’s the image style for your AI model?</h2>}
        <Row className="justify-content-start">


          {isLoading ? <Loading /> : <ModelCard models={models} handleModifySelect={handleModelSelect} />}

        </Row>
      </Container>
    </div>
  );
}