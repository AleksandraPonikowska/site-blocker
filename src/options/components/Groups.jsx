import React, { useState, useMemo, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Group from "./Group.jsx";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import Site from './Site.jsx';

const Groups = ({ initialGroups = [], sites = [], setSites = () => {}, setGlobalGroups = () => {} }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeSite, setActiveSite] = useState(null);

  const isNumber = (value) => {
    return typeof value === 'number' && isFinite(value);
  }

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

    if(isNumber(event.active.id)){
      setDoWeDrag(true);
      const group = groups.find(g => g.id === event.active.id);
      setActiveGroup(group);
    } else {
      const site = sites.find(s => s.hostname === event.active.id);
      setActiveSite(site)
    }
    
  }

  function handleDragEnd(event) {
    setActiveGroup(null);
    setActiveSite(null);
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

  function handleDragOver(event){
    const { active, over } = event;
    if (!over || !active) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId == overId) return;

    const isActiveASite = active.data.current?.type == "site";
    const isOverASite = over.data.current?.type == "site";

    //const isActiveASite = active.data.current?.hostname;
    //const isOverASite = over.data.current?.hostname;

    if(!isActiveASite) return;

    if (isActiveASite && isOverASite){
      const activeIndex = sites.findIndex(t => t.hostname === activeId);
      const overIndex = sites.findIndex(t => t.hostname === overId);
      console.log(sites[activeIndex])
      console.log(sites[overIndex])
      sites[activeIndex].groupId = sites[overIndex].groupId;
      const ret = arrayMove(sites, activeIndex, overIndex);

      setSites(ret);

    }  

    const isOverAGroup = over.data.current?.type == "group";

    if(isActiveASite && isOverAGroup){
      const activeIndex = sites.findIndex(t => t.hostname === activeId);
      sites[activeIndex].groupId = overId;
      const ret = arrayMove(sites, activeIndex, activeIndex);

      console.log("OVER A GROUP");
      setSites(ret);
    }


    
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

  const deleteSite = (hostname) => {
    const newSites = sites.filter(s => s.hostname !== hostname);
    setSites(newSites);
  };

  return (
    <div className="blocked-sites">
      <h2>Groups</h2>
      <DndContext collisionDetection={closestCorners}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        >
        <SortableContext items={groupsIds} strategy={verticalListSortingStrategy}>
          {groups.map(group => (
            <Group
              key={group.id}
              id={group.id}
              name={group.name}
              sites={sites.filter(s => s.groupId === group.id)}
              onDelete={deleteGroup}
              onSiteDelete={deleteSite}
              updateName={(newName) => {
                const newGroups = groups.map(g => g.id === group.id ? { ...g, name: newName } : g);
                setGroups(newGroups);
                setGlobalGroups(newGroups);
              }}
            />
          ))}
        </SortableContext>

        <button className={"addButton"} onClick={addGroup}><span>+</span></button>
        <br></br>

        {createPortal(
          <DragOverlay>
            {activeGroup && (
              <Group
                id={activeGroup.id}
                name={activeGroup.name}
                sites={sites.filter(s => s.groupId === activeGroup.id)}

              />
            )}
            {
              activeSite && <Site site={activeSite} onDelete={() => {}}/>
            }
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default Groups;
