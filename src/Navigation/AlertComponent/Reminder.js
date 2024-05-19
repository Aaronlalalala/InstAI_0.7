import React from 'react';
import { Navbar, Card, Button } from 'react-bootstrap';
import instAI_icon from "../../image/instai_icon.png";

const Reminder = ({ message, onConfirm }) => {
  return (
    <>
      <Navbar bg="light" style={{ paddingLeft: '100px' ,width: '30vw', height: '5vw',border:'0.5px solid' }}>
        <img
          src={instAI_icon}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="InstAI logo"
        />
        <Navbar.Brand className="ml-auto">Reminder</Navbar.Brand>
      </Navbar>
      <Card className="m-2.5" style={{ width: '30vw', height: '10vw', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
        <Card.Body>
          <Card.Text>{message}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Reminder;
