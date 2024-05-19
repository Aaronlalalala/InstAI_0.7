import React, { useState, useEffect } from 'react';
import loginstyle from "./Upload.module.css";
import { NavLink } from 'react-router-dom';

function Viewupload() {
  const [imageURLs, setImageURLs] = useState([]);

  const fetchImageURLs = async () => {
    try {
      const response = await fetch('http://8080/api/upload/upload?username=${username}'); // 替換為實際的後端路由
      if (response.ok) {
        const data = await response.json();
        setImageURLs(data.imageURLs); // 假設後端返回了圖片 URL 的數據
      } else {
        console.error('Error fetching image URLs');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchImageURLs();
  }, []);

  return (
    <div className={loginstyle.login}>
      <h2>Images from Backend</h2>
      {imageURLs.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index}`} style={{ height: 80, width: 80}} />
      ))}
      <NavLink to="/Download">
        download
      </NavLink>
    </div>
  );
}

export default Viewupload;