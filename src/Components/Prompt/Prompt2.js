
import React, { useState } from 'react';
import './Prompt.css';


const Prompt2 = ({ onChange }) => {
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
      <h3></h3>
      <textarea
        className="input-field"
        placeholder="請輸入"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterKeyPress}
      />
    </div>
  );
};

export default Prompt2;
