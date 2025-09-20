import React from "react";
import DropDown from "./DropDown";

function Rule({ rule, onChange }) {
  const handleTypeChange = (newType) => {
    const updatedRule = { ...rule, type: newType };
    onChange(updatedRule);
  };

  const handleStartTimeChange = (e) => {
    const updatedRule = { ...rule, startTime: e.target.value };
    onChange(updatedRule);
  };

  const handleEndTimeChange = (e) => {
    const updatedRule = { ...rule, endTime: e.target.value };
    onChange(updatedRule);
  };

  const handleDayToggle = (index) => {
    const updatedDays = [...rule.days];
    updatedDays[index] = !updatedDays[index];
    const updatedRule = { ...rule, days: updatedDays };
    onChange(updatedRule);
  };

  return (
    <div className="rule">
      <div>
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

      <div>
        <span>Start time: </span>
        <input
          type="time"
          value={rule.startTime || ""}
          onChange={handleStartTimeChange}
        />
      </div>

      <div>
        <span>End time: </span>
        <input
          type="time"
          value={rule.endTime || ""}
          onChange={handleEndTimeChange}
        />
      </div>

      <div>
        <span>Days: </span>
        <div className="flex gap-2">
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
            (day, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={rule.days?.[index] || false}
                  onChange={() => handleDayToggle(index)}
                />
                <span>{day}</span>
              </label>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Rule;
