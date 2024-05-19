import React from 'react';
import { Navbar, Nav, Card, Button } from 'react-bootstrap'; // Import Button here
import instAI_icon from "../../image/instai_icon.png";

const ConfirmPage = ({ message }) => {
  return (
    <div >
      <Navbar bg="light" style={{ paddingLeft: '100px' ,width: '20vw', height: '5vw' ,border:'0.5px solid'}}>
        <img
          src={instAI_icon}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="InstAI logo"
        />
        <Navbar.Brand className="ml-auto">Warning</Navbar.Brand>
      </Navbar>
      <Card className="m-2.5" style={{ width: '20vw', height: '10vw', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
        <Card.Body>
          <Card.Text>{message}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-around" style={{background:'white'}}>
          <Button variant="primary" className="mr-2" style={{ width: '40%' }}>Yes</Button>
          <Button variant="secondary" style={{ width: '40%' }}>No</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ConfirmPage;
