import React from 'react';

import { SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import Task from './Task.jsx';
import "./Group.css"
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities"; 
import { useMemo } from 'react';

function Group({ id, name, sites = [], onDelete = () => {} , updateName = () => {}, onTaskDelete = () => {}}) {

    const [editMode, setEditMode] = React.useState(false);

    const {setNodeRef,
        attributes, 
        listeners, 
        transform, 
        transition,
        isDragging
    } = useSortable({
        id: id,
        data: { type: "group", groupId: id },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    if (isDragging) {
        style.opacity = 0.5;
        style.border = "2px dashed gray";
        style.cursor = "grabbing";
        // i might want to return a div here instead
        // but i'd have to know the height :(
    }

    const siteIds = useMemo(() => sites.map(site => site.hostname), [sites]);





    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group">

            { id !== 0 && (
            <button
                className="button-delete"
                onClick={() => onDelete(id)}
            >
                ✖
            </button>
            )}


            <h3
            {...attributes}
            {...listeners}
            onClick={()=>setEditMode(true)}>
                
                {!editMode && name}
                {editMode && (
                    <input
                        className = "input"
                        value = {name}
                        onChange={(e)=> updateName(e.target.value)}
                        autoFocus
                        onBlur={()=> setEditMode(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setEditMode(false);
                            }
                        }}
                    />)}
            
            </h3>
            <SortableContext items={siteIds} strategy={verticalListSortingStrategy}>
            {sites.map(s => (
                <Task key={s.hostname} site={s} onDelete={() => onTaskDelete(s.hostname)}/>
            ))}
            </SortableContext>
        </div>
    );
}


export default Group;