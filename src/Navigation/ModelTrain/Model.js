import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InstAI_icon from "../../image/instai_icon.png";
import yolov3Model from '../../model/AD6F1091A9FD04D8298166B9DB990614977F8760_yolov3tiny'; //使用按鍵下載這個模型

import { Navbar,Nav,Card,Container,Button, Row , Col,ProgressBar} from "react-bootstrap";

function Model(){
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname'); 
  const id = localStorage.getItem('userId');
  const p = process.env;
  const [step , setStep]=useState('');

  console.log("project name is ",projectname);
  useEffect(()=>{

  },[])
  const handleBack = () =>{
    navigate(`/Step?project=${projectname}`);
  }

  return(
    <div style={{backgroundColor:'white'}}>
     <Navbar bg="white" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
    <Nav className="mr-auto">
    <Nav className="mr-auto" style={{marginLeft:"10px"}}>
         <h3 onClick={handleBack}>Back</h3>
        </Nav>
    </Nav>
    <Navbar.Brand href="#home" className="mx-auto">
      <img
        src={InstAI_icon} 
        width="60"
        height="60"
        className="d-inline-block align-top"
        alt="InstAI logo"
      />
      InstAI
    </Navbar.Brand>
  </Navbar>
  
  <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Request Received</Card.Title>
              <Card.Text>
                We have received your request. You will be notified via email for updates.
              </Card.Text>
              <ProgressBar now={60} label={`${60}%`} />
              <Card.Text>
                Training AI Model
              </Card.Text>
              <Card.Text>
                Questions? Contact us at support@instai.com
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default Model;
