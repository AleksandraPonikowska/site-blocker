import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import Group from "./Group.jsx";

const Groups = ({ sites = [], setSites = () => {} }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sites.findIndex((site) => site.hostname === active.id);
      const newIndex = sites.findIndex((site) => site.hostname === over.id);

      const newSites = Array.from(sites);
      const [movedItem] = newSites.splice(oldIndex, 1);
      newSites.splice(newIndex, 0, movedItem);

      setSites(newSites);
    }
  };

  return (
    <div className="blocked-sites">
      <h2>Groups</h2>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Group sites={sites} />
      </DndContext>
    </div>
  );
};

export default Groups;
