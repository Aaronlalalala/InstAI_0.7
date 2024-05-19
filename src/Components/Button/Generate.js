import React from 'react';
import "../style/Button.css";

function Generate({ onClick }) {
  return (
    <button className="custom-button" onClick={onClick}>
      Generate
    </button>
  );
}

export default Generate;
