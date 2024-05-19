import React , {useState , useEffect,useCallback} from "react";
import {NavLink, useNavigate , useLocation} from "react-router-dom";
// import { BounceLoader } from "react-spinners";
import InstAI_icon from '../../image/instai_icon.png'
// import arrow from "../../image/arrow.png"; 這個圖片不好用
import axios from 'axios';
import { Navbar, Nav, Button, Container, Row, Col, Card } from 'react-bootstrap';
import imgTraining from "../../image/imgTraing.png";
import modelTraing from "../../image/modelTraining.png";

function DecisionPage (){
    const location = useLocation();
    const navigate = useNavigate();
    const id = localStorage.getItem("userId");
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const p = process.env;
    const [typeOfProject, setTypeOfProject] = useState(1); //有使用生成的是1 沒有的是2
    
    useEffect(()=>{
    },[]);
    
    const navigateModel = () => {
      const y = window.confirm("確定直接進行模型訓練?");
      if(y){
        const newTypeOfProject = 2; // 設置新的 typeOfProject 為 2
        setTypeOfProject(newTypeOfProject);
        navigate(`/CreatePage`,{state:{typeOfProject: newTypeOfProject}});
      }
    }
    
    const navigateImg = () => {
      const y = window.confirm("確定前往圖片生成?");
      if(y){
        const newTypeOfProject = 1; // 設置新的 typeOfProject 為 1
        setTypeOfProject(newTypeOfProject);
        navigate(`/CreatePage`,{state:{typeOfProject: newTypeOfProject}});
      }
    }
    
    useEffect(() => {
      console.log("project type is ", typeOfProject);
    }, [typeOfProject]); 

    

    return (
      <div style={{ backgroundColor: 'white' }}> 
        <Navbar style={{ backgroundColor: 'white' ,boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}} >
          <Nav className="mr-auto" style={{marginLeft:"10px"}}>
          <div className="col-auto mt-4"> 
            <NavLink to={`/Project?type=1`} className="projectPageLink">
            <button className="btn createprojectPageButton" style={{ marginLeft: "10px", fontFamily: 'Lato' }}>
              <h3 style={{ marginLeft: "10px" }}>←Back</h3>
            </button>
            </NavLink>
          </div>
            {/* <h3 style={{marginLeft:"10px"}}>Back</h3> */}
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
        <Container className="d-flex flex-column justify-content-center" style={{ 
          minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', 
          backgroundColor: 'white', borderRadius: '15px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' 
          }}>
        <h2 className="text-center" style={{ marginLeft: "10px", fontFamily: 'Lato', fontStyle: 'normal' }}>What would you like to try?</h2>
        <Row className="justify-content-around">
          <Col md={5}>
            <Card>
              <Card.Body>
                <img
                src={modelTraing}
                width='70'
                height='70'
                className="d-inline-block align-top"
                alt="modelTraing"
                />
                <Card.Title>AI Model Training</Card.Title>
                <Card.Text>Dorem ipsum dolor sit amet, consectetur adipiscing elit.</Card.Text>
                <Button variant="primary" style={{width:"100%"}} onClick={navigateModel}>Choose</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card>
              <Card.Body>
              <img
                src={imgTraining}
                width='70'
                height='70'
                className="d-inline-block align-top"
                alt="modelTraing"
                />
                <Card.Title>Image Generation</Card.Title>
                <Card.Text>Generate 25 image data for AI model training for free</Card.Text>
                <Button variant="primary" style={{width:"100%"}} onClick={navigateImg}>Choose</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      </div>
    );
  };


export default DecisionPage;