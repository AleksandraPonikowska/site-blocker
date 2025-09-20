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
        defaultValue={chosenGroup}
        onChange={(val) => setChosenGroup(val)}
      />
      {currentRules.map((rule, index) => (
        <Rule
          key={rule.id ?? index}
          rule={rule}
          onChange={(val) => modifyRule(index, val)}
        />
      ))}
    </div>
  );
}

export default Rules;
