import React from "react";
import DropDown from "./DropDown";
import "./Rule.css";
import TimeRange from "./TimeRange";

function Rule({ rule, onChange, onDelete }) {

  const handleTypeChange = (newType) => {
    const updatedRule = { ...rule, type: newType };
    onChange(updatedRule);
  };

  const handleTimeChange = (index, updatedTimeRange) => {
    const updatedTimeRanges = [...rule.timeRanges];
    updatedTimeRanges[index] = {
      ...updatedTimeRange
    };
    console.log(updatedTimeRanges);
    const updatedRule = { ...rule, timeRanges: updatedTimeRanges };
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

      <button
        className="button-delete"
        onClick={() => onDelete(rule.id)}
      >
      ✖
      </button>

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

        {rule.timeRanges.map((tr, idx) => (
          <TimeRange
            idx={idx}
            data={tr}
            onChange={(index, updatedRange) => {
              handleTimeChange(index, updatedRange);
            }}
            onClick ={() => {
              const updatedTimeRanges = rule.timeRanges.filter((_, i) => i !== idx);
              const updatedRule = { ...rule, timeRanges: updatedTimeRanges };
              onChange(updatedRule);
            }}
          />
        ))}
        <button
          onClick={() => {
            const updatedTimeRanges = [...rule.timeRanges, {startTime: "00:00", endTime: "23:59"}];
            const updatedRule = { ...rule, timeRanges: updatedTimeRanges };
            onChange(updatedRule);
          }}
        >
          +
        </button>
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
