import React, { useState } from 'react';
import "../style/slider.css";

function DenoisingStrength({ value, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);
  const [inputValue, setInputValue] = useState(value.toFixed(2)); 

  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);
    setInputValue(newValue.toFixed(2));
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    let newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) {
      newValue = 0; 
    }
    newValue = Math.min(1, Math.max(0, newValue));
    setSliderValue(newValue);
    setInputValue(newValue.toFixed(2)); 
    onChange(newValue);
  };

  return (
    <div className="slider-container">
      <h4>Denoising Strength</h4>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01" 
        value={sliderValue}
        className="slider"
        onChange={handleSliderChange}
      />
      <input
        type="number"
        min="0"
        max="1"
        step="0.01" 
        value={inputValue}
        className="input"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default DenoisingStrength;

