import React, { useState } from 'react';
import "../style/prompt.css";

const Prompt = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value); // 在值更改時調用傳遞的onChange函數，并傳遞到父組件
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      onChange(inputValue); // 在按下Enter键时調用傳遞的onChange函数
    }
  };

  return (
    <div className="input-container">
      <h3>Prompt</h3>
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

export default Prompt;

