import React, { useState } from 'react';
import "../style/Dropdown.css";

function ResizeMode({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (selectedValue) => {
    toggleDropdown();
    onChange(selectedValue); 
  };

  return (
    <div className="dropdown-container">
      <span style={{ color: "black" }}>ResizeMode</span>
      <button onClick={toggleDropdown} className="dropdown-button" style={{ width:500, left:-20, top:50}}>
        {value || '選擇一個值'}
      </button>
      <ul className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
        <li onClick={() => handleOptionClick(0)}>just resize</li>
        <li onClick={() => handleOptionClick(1)}>Crop and resize</li>
        <li onClick={() => handleOptionClick(2)}>Resize and fill</li>
        <li onClick={() => handleOptionClick(3)}>just resize(latent upscale)</li>
      </ul>
    </div>
  );
}

export default ResizeMode;
