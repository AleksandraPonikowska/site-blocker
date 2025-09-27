import React from "react";
import "./Rule.css";

function TimeRange({ idx, data, onChange, onClick }) {

  const handleStartChange = (e) => {
    const updatedRange = {startTime: e.target.value, endTime: data.endTime};
    onChange(idx, updatedRange);    
  };

  const handleEndChange = (e) => {
    const updatedRange = {startTime: data.startTime, endTime: e.target.value};
    onChange(idx, updatedRange);  
  };

  return (
    <div className="input">
      <input
        type="time"
        value={data.startTime || ""}
        onChange={handleStartChange}
      />
      ㅤtoㅤ
      <input
        type="time"
        value={data.endTime || ""}
        onChange={handleEndChange}
      />
      
      <button 
        className="tm-button-delete"
        onClick={() => {
        onClick();
      }}>✖</button>
    </div>
  );
}

export default TimeRange;
