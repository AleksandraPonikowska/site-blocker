import React from "react";
import "./DropDown.css";

function DropDown({ options = [], value = 0, onChange = () => {} }) {
  const handleChange = (event) => {
    const val = Number(event.target.value);
    onChange(val);
  };

  return (
    <div>
      <select className="dropdown-select" value={value} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropDown;
