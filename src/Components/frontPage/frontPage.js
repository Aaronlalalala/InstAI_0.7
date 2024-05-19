import React from "react";
import { NavLink } from "react-router-dom";
import loginstyle from "./frontPage.module.css";

// Loginstyle for background and 2 element for table and web bar

function FrontPage(){
  return(
    
    <header className = {loginstyle.header}>
    <h1 className = {loginstyle.h1}>Inst-Ai</h1>
    <ul>
      <li>
        <NavLink className = {loginstyle.NavLink} to ="/Login">
          Login
        </NavLink>
      </li>
      <li>
        <NavLink className = {loginstyle.NavLink} to="/signup">
          Register
        </NavLink>
      </li>
    </ul>
  </header>
    
  );
}

export default FrontPage;
