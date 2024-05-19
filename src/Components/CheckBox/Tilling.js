import React, { useState } from 'react';
import "../style/CheckBox.css";

function Tilling({ onChange }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newCheckedValue = !isChecked;
    setIsChecked(newCheckedValue);
    onChange(newCheckedValue); // 通知父组件复选框的状态已更改
  };

  return (
    <div className="checkbox-container">
      <div
        className={`checkbox-icon ${isChecked ? 'checked' : ''}`}
        onClick={handleCheckboxChange}
      >
        {isChecked && <span>&#10003;</span>}
      </div>
      <label className="checkbox-label">Tilling</label>
    </div>
  );
}

export default Tilling;