import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Group from "./Group.jsx";

const Groups = ({ groups = [], sites = [], setSites = () => {}, setGroups = () => {} }) => {

  
  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const newGroupId = 
      over.data.current?.sortable?.containerId ?? over.id;


    console.log("Moving site", activeId, "to group", newGroupId);

    setSites((prevSites) =>
      prevSites.map((site) =>
        site.hostname === activeId ? { ...site, groupId: Number(newGroupId) } : site
      )
    );


    //if (active.id !== over.id) {
    //  const oldIndex = sites.findIndex((s) => s.hostname === active.id);
    //  const newIndex = sites.findIndex((s) => s.hostname === over.id);
    //  setSites(arrayMove(sites, oldIndex, newIndex));
    //}
  };


  return (
    <div className="blocked-sites">          
      <h2>Groups</h2>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        {groups.map((group) => (
          <Group
            key={group.id}
            id ={group.id}
            name={group.name}
            sites={sites.filter((s) => s.groupId === group.id)}
            onDelete = {(id) => {
              console.log("Deleting group with id:", id);
              const newGroups = groups.filter(g => g.id !== id);
              const newSites = sites.map(site => site.groupId === id ? {...site, groupId: 0} : site);
              setGroups(newGroups);
              setSites(newSites);
            }}
          />
        ))}
      </DndContext>
      <button onClick={() => {
        const newGroup = { id: groups.length, name: `Group ${groups.length}` };
        const newGroups = [...groups, newGroup];
        chrome.storage.sync.set({ groups: newGroups });
      }}>+</button>
    </div>
  );
};

export default Groups;
