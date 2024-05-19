import React, { useState } from 'react';
import "../style/CheckBox.css";

function Hires({ onChange }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newCheckedValue = !isChecked;
    setIsChecked(newCheckedValue);
    onChange(newCheckedValue); // 通知父組件選相框已被勾選
  };

  return (
    <div className="checkbox-container">
      <div
        className={`checkbox-icon ${isChecked ? 'checked' : ''}`}
        onClick={handleCheckboxChange}
      >
        {isChecked && <span>&#10003;</span>}
      </div>
      <label className="checkbox-label">Hires.fix</label>
    </div>
  );
}

export default Hires;