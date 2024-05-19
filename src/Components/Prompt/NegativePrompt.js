import React, { useState } from 'react';
import "../style/prompt.css";

const NegativePrompt = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value); 
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      onChange(inputValue); 
    }
  };

  return (
    <div className="input-container">
      <h3>Negative Prompt</h3>
      <input
        type="text"
        className="input-field"
        placeholder="請輸入"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterKeyPress}
      />
    </div>
  );
};

export default NegativePrompt;




