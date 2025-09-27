import React, { useState } from "react";
import DropDown from "./DropDown";
import Rule from "./Rule";

function Rules({ groups, rules, setRules }) {
  const [chosenGroup, setChosenGroup] = useState(0);

  const modifyRule = (index, newRule) => {
    console.log("Current Rules:", rules);

    const filteredRules = rules.filter(rule => rule.groupId === chosenGroup);
    const ruleToUpdate = filteredRules[index];

    if (!ruleToUpdate) return;

    const updatedRules = rules.map(rule =>
      rule.id === ruleToUpdate.id ? newRule : rule
    );

    setRules(updatedRules);

    console.log("Updated Rules:", updatedRules);
  };

  const currentRules = rules.filter(rule => rule.groupId === chosenGroup) || [];

  return (
    <div>
      <h2>Rules</h2>
      <DropDown
        options={groups}
        value={chosenGroup}
        onChange={(val) => setChosenGroup(val)}
      />
      

      {currentRules.map((rule, index) => (
        <Rule
          key={rule.id ?? index}
          rule={rule}
          onChange={(val) => modifyRule(index, val)}
          onDelete ={(id) => {setRules(rules.filter(rule => rule.id !== id))}}
        />
      ))}

      <button
        onClick={() => {
          const newRule = {
            id: Date.now(),
            groupId: chosenGroup,
            type: 0,
            timeRanges: [{ startTime: "00:00", endTime: "23:59" }],
            days: [true, true, true, true, true, false, false],
          };
          setRules([...rules, newRule]);
        }}
      >
        +
      </button>
    </div>
  );
}

export default Rules;
