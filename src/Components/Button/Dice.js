import React, { useState } from 'react';
import "../style/Button.css";

function Dice() {
  const [randomNumber, setRandomNumber] = useState(null);

  const handleClick = () => {
    // 產生一個1到6之間的隨機數字
    const min = 1;
    const max = 6;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    // 更新狀態以顯示隨機數字
    setRandomNumber(randomNum);
  };

  return (
    <div>
      <button className="custom-button" onClick={handleClick}>
        Roll Dice
      </button>
      {randomNumber !== null && (
        <p>隨機數字: {randomNumber}</p>
      )}
    </div>
  );
}

export default Dice;
