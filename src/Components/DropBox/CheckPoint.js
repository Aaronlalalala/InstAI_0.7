import React, { useState ,useEffect } from 'react';
import "../style/Dropdown.css";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function CheckPoint({ value, onChange }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null); // 確保這裡有定義
  const [fileList, setFileList] = useState([]); // State to store the list of filenames

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/upload/checkdata?check=model&username=${id}`)
      .then((response) => {
        setFileList(response.data); // Set the list of filenames received from the server
        //alert('Filenames loaded successfully');
      })
      .catch((error) => {
        console.error(error);
        console.error('文件讀取失敗');
      });
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (selectedValue) => {
    setSelectedValue(selectedValue); 
    toggleDropdown();
    onChange(selectedValue);
  };

  return (
    <div className="dropdown-container" style={{width:300,top:-10}}>
      <span style={{ color: "black" }}>Stable Diffusion CheckPoint</span>
      <button onClick={toggleDropdown} className="dropdown-button" style={{width:300,left:0}}>
        {selectedValue || '選擇一個值'}
      </button>
      <ul className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
        <li onClick={() => handleOptionClick("sd-v1-5-inpainting.ckpt [c6bbc15e32]")}>sd-v1-5-inpainting.ckpt [c6bbc15e32]</li>
        {/* <li onClick={() => handleOptionClick(2)}>2</li>
        <li onClick={() => handleOptionClick(3)}>3</li> */}
        {/* {fileList.map((filename, index) => (
          <li key={index} onClick={() => handleOptionClick(filename)}>
            {filename}
          </li>
        ))} */}
      </ul>
    </div>
  );
}

export default CheckPoint;



