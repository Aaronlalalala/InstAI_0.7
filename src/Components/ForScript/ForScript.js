import React, { useState } from 'react';

function ForScript({ value, onChange }) {
  const [selectedCategory, setSelectedCategory] = useState(''); // 
  const [inputNumber, setInputNumber] = useState(0);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleInputNumberChange = (event) => {
    setInputNumber(event.target.value);
  };

  const handleUpdateScripts = () => {
    const updatedData = {
      [selectedCategory]: [parseInt(inputNumber, 10)],
    }; // 包裹輸入數字

    onChange(updatedData);
    setInputNumber('');
    setSelectedCategory('');
  };

  return (
    <div>
      <label>
        遊樂場的遊樂設施：
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">喻翔大帥哥</option>
          <option value="Lora">Lora</option>
          <option value="tan">tan</option>
          <option value="彥君">彥君</option>
        </select>
      </label>
      <br />
      <label>
        影響參數：
        <input
          type="number"
          value={inputNumber}
          onChange={handleInputNumberChange}
        />
      </label>
      <br />
      <button onClick={handleUpdateScripts}>送出</button>
    </div>
  );
}

export default ForScript;
