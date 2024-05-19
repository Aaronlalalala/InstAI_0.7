import React, { useState } from 'react';
import "../style/slider.css";

function SamplingStep({ value, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    setInputValue(newValue);
    onChange(newValue); 
  };

  const handleInputChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    newValue = Math.min(150, Math.max(20, newValue));
    setSliderValue(newValue);
    setInputValue(newValue);
    onChange(newValue); 
  };

  return (
    <div className="slider-container">
      <h4>SamplingStep</h4>
      <input
        type="range"
        min="20"
        max="150"
        value={sliderValue}
        className="slider"
        onChange={handleSliderChange}
      />
      <input
        type="number"
        min="20"
        max="150"
        value={inputValue}
        className="input"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SamplingStep;