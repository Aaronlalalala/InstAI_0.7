import React, { useState } from 'react';
import "../style/Dropdown.css";

function SamplingMethod({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    onChange(value); // 呼叫父元件的事件處理函數
    toggleDropdown();
  };

  return (
    <div className="dropdown-container">
      <span style={{ color: "black" }}>SamplingMethod</span>
      <button onClick={toggleDropdown} className="dropdown-button" style={{width:500,height:70,top:50 ,left:-20}}>
        {selectedValue || '選擇一個值'}
      </button>
      <ul className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
        <li onClick={() => handleOptionClick("Euler a")}>Euler a</li>
        <li onClick={() => handleOptionClick("Euler")}>Euler</li>
        <li onClick={() => handleOptionClick("LMS")}>LMS</li>
        <li onClick={() => handleOptionClick("Heun")}>Heun</li>
        <li onClick={() => handleOptionClick("DPM2")}>DPM2</li>
        <li onClick={() => handleOptionClick("DPM2 a")}>DPM2 a</li>
        <li onClick={() => handleOptionClick("DPM++ 2S a")}>DPM++ 2S a</li>
        <li onClick={() => handleOptionClick("DPM++ 2M")}>DPM++ 2M</li>
        <li onClick={() => handleOptionClick( "DPM++ SDE")}> DPM++ SDE</li>
        <li onClick={() => handleOptionClick("DPM++ 2M SDE")}>DPM++ 2M SDE</li>
        <li onClick={() => handleOptionClick("DPM fast")}>DPM fast</li>
        <li onClick={() => handleOptionClick("DPM adaptive")}>DPM adaptive</li>
        <li onClick={() => handleOptionClick("LMS Karras")}>LMS Karras</li>
        <li onClick={() => handleOptionClick("DPM2 Karras")}>DPM2 Karras</li>
        <li onClick={() => handleOptionClick("DPM2 a Karras")}>DPM2 a Karras</li>
        <li onClick={() => handleOptionClick("DPM++ 2S a Karras")}>DPM++ 2S a Karras</li>
        <li onClick={() => handleOptionClick("DPM++ 2M Karras")}>DPM++ 2M Karras</li>
        <li onClick={() => handleOptionClick("DPM++ SDE Karras")}>DPM++ SDE Karras</li>
        <li onClick={() => handleOptionClick("DPM++ 2M SDE Karras")}>DPM++ 2M SDE Karras</li>
        <li onClick={() => handleOptionClick("DDIM")}>DDIM</li>
        <li onClick={() => handleOptionClick("PLMS")}>PLMS</li>
        <li onClick={() => handleOptionClick("UniPC")}> UniPC </li>
      </ul>
    </div>
  );
}

export default SamplingMethod;