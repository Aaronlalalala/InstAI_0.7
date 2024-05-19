import React, { useState } from 'react';
import "../style/slider.css";

function DenoisingStrength({ value, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);
  const [inputValue, setInputValue] = useState(value.toFixed(2)); // 使用兩位小數來初始化輸入值

  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);
    setInputValue(newValue.toFixed(2)); // 以兩位小數格式設定輸入值
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    let newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) {
      newValue = 0; // 如果解析失敗（非數字輸入），則設置為0
    }
    newValue = Math.min(0.75, Math.max(0, newValue));
    setSliderValue(newValue);
    setInputValue(newValue.toFixed(2)); // 以兩位小數格式設定輸入值
    onChange(newValue);
  };

  return (
    <div className="slider-container">
      <h4>Denoising Strength</h4>
      <input
        type="range"
        min="0"
        max="0.75"
        step="0.01" // 設置步進值為0.01（兩位小數）
        value={sliderValue}
        className="slider"
        onChange={handleSliderChange}
      />
      <input
        type="number"
        min="0"
        max="0.75"
        step="0.01" // 設置步進值為0.01（兩位小數）
        value={inputValue}
        className="input"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default DenoisingStrength;