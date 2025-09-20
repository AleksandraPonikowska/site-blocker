import React from "react";
import DropDown from "./DropDown";
import "./Rule.css";

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
        <h3>set type</h3>
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
        <h3>set time</h3>
        <input
          type="time"
          value={rule.startTime || ""}
          onChange={handleStartTimeChange}
        />
        ㅤtoㅤ
        <input
          type="time"
          value={rule.endTime || ""}
          onChange={handleEndTimeChange}
        />
      </div>

      <div>
        <h3>set days</h3>
        <div className="flex gap-2">
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
            (day, index) => (
              <label key={index} className="day-toggle">
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
