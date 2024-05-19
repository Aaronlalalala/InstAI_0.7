import React, { useState } from 'react';
import "../style/CheckBox.css"

function LatentUpscale() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="checkbox-container">
      <div
        className={`checkbox-icon ${isChecked ? 'checked' : ''}`}
        onClick={handleCheckboxChange}
      >
        {isChecked && <span>&#10003;</span>}
      </div>
      <label className="checkbox-label">Jusr resize (latent upscale)</label>
    </div>
  );
}

export default LatentUpscale;