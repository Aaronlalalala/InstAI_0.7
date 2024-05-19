import React, { useState } from 'react';
import "../style/slider.css";

function Seed({ value, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    setInputValue(newValue);
    onChange(newValue); // 通知父組件TXTPage 數值以更改
  };

  const handleInputChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    newValue = Math.min(1000, Math.max(-1, newValue));
    setSliderValue(newValue);
    setInputValue(newValue);
    onChange(newValue); // 通知父组件值已更改
  };

  return (
    <div className="slider-container">
      <h4>Seed</h4>
      <input
        type="range"
        min="-1"
        max="1000"
        value={sliderValue}
        className="slider"
        onChange={handleSliderChange}
      />
      <input
        type="number"
        min="1"
        max="1000"
        value={inputValue}
        className="input"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default Seed;