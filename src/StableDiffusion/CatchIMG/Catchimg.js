import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import './catch.css';

function CatchTXTimage() {
  const [images, setImages] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // 用於追蹤用戶選擇的圖像

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/img2img/process');
      setImages(response.data);
      setError(null);
    } catch (error) {
      console.error('從API獲取數據時出錯:', error);
      setError('數據獲取失敗');
    }
  };

  const encodeImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = function () {
          const base64String = reader.result.split(',')[1];
          downloadSingleImage(base64String, images.length);
        };

        reader.readAsDataURL(blob);
      } else {
        console.error('獲取圖像時出錯。');
      }
    } catch (error) {
      console.error('發生錯誤:', error);
    }
  };

  const downloadSingleImage = (base64, index) => {
    const newImages = [...images];
    newImages[index] = base64;
    setImages(newImages);
  };

  // 處理用戶選擇圖像的函數
  const handleImageSelect = (index) => {
    if (selectedImages.includes(index)) {
      // 如果已選擇，從列表中刪除
      const newSelectedImages = selectedImages.filter((selected) => selected !== index);
      setSelectedImages(newSelectedImages);
    } else {
      // 如果未選擇，添加到列表中
      setSelectedImages([...selectedImages, index]);
    }
  };

  const downloadSelectedImages = async () => {
    if (selectedImages.length === 0) return;
    const zip = new JSZip();

    selectedImages.forEach((index) => {
      const base64 = images[index];
      const fileName = `image_${index + 1}.jpg`;
      zip.file(fileName, base64, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected_images.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  useEffect(() => {
    // 組件掛載時獲取數據
    fetchDataFromAPI();
  }, []); // 空的依賴數組確保此代碼只執行一次。

  return (
    <div className="catch-container">
      <button onClick={downloadSelectedImages}>壓縮所選圖像</button>
      {error && <p className="error-message">{error}</p>}
      <div className="image-container">
        {images.map((base64, index) => (
          <div key={index} className="image-item">
            <img src={base64} alt={`圖像 ${index}`} loading="lazy" />
            <input
              type="checkbox"
              checked={selectedImages.includes(index)}
              onChange={() => handleImageSelect(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatchTXTimage;
