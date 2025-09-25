import React, { useState, useMemo, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Group from "./Group.jsx";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";

const Groups = ({ initialGroups = [], sites = [], setSites = () => {}, setGlobalGroups = () => {} }) => {
  const [activeGroup, setActiveGroup] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [groups, setGroups] = useState([]);

  const [doWeDrag, setDoWeDrag] = useState(false);

  useEffect(() => {
    if (initialGroups.length > 0) {
      if (!doWeDrag)
        setGroups(initialGroups);
    }
  }, [initialGroups]);

  const groupsIds = useMemo(() => groups.map(g => g.id), [groups]);

  function handleDragStart(event) {
    setDoWeDrag(true);
    const group = groups.find(g => g.id === event.active.id);
    setActiveGroup(group);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || !active) return;

    const activeGroup = groups.find(g => g.id === active.id);
    const overGroup = groups.find(g => g.id === over.id);

    if (activeGroup && overGroup && active.id !== over.id) {
      const oldIndex = groups.indexOf(activeGroup);
      const newIndex = groups.indexOf(overGroup);
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      setGroups(newGroups);
      setGlobalGroups(newGroups);
    }

    setActiveGroup(null);
  }

  const addGroup = () => {
    const newId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 0;
    const newGroup = { id: newId, name: `Group ${newId}` };
    const newGroups = [...groups, newGroup];
    setGroups(newGroups);
    setGlobalGroups(newGroups);
  };

  const deleteGroup = (id) => {
    const newGroups = groups.filter(g => g.id !== id);
    const newSites = sites.map(site => site.groupId === id ? { ...site, groupId: 0 } : site);
    setGroups(newGroups);
    setGlobalGroups(newGroups);
    setSites(newSites);
  };

  return (
    <div className="blocked-sites">
      <h2>Groups</h2>
      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={groupsIds} strategy={verticalListSortingStrategy}>
          {groups.map(group => (
            <Group
              key={group.id}
              id={group.id}
              name={group.name}
              sites={sites.filter(s => s.groupId === group.id)}
              onDelete={deleteGroup}
              updateName={(newName) => {
                const newGroups = groups.map(g => g.id === group.id ? { ...g, name: newName } : g);
                setGroups(newGroups);
                setGlobalGroups(newGroups);
              }}
            />
          ))}
        </SortableContext>

        <button onClick={addGroup}>+</button>

        {createPortal(
          <DragOverlay>
            {activeGroup && (
              <Group
                id={activeGroup.id}
                name={activeGroup.name}
                sites={sites.filter(s => s.groupId === activeGroup.id)}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default Groups;
