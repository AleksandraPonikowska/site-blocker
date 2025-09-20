import React from "react";
import DropDown from "./DropDown";

function Rule({ rule, onChange }) {
  const handleTypeChange = (newType) => {
    const updatedRule = { ...rule, type: newType };
    onChange(updatedRule);
  };

  return (
    <div className="rule">
      <span>Type: </span>
      <DropDown
        options={[
          { id: 0, name: "block" },
          { id: 1, name: "delay" },
          { id: 2, name: "gray-scale" },
        ]}
        value={rule.type}
        onChange={handleTypeChange}
      />
    </div>
  );
}

export default Rule;
