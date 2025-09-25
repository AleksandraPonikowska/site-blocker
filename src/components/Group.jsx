import React from 'react';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task.jsx';
import "./Group.css"
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities"; 

function Group({ id, name, sites = [], onDelete = () => {} }) {

    const {setNodeRef, attributes, listeners, transform, transition,
            isDragging
    } = useSortable({
        id: id
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

    const siteIds = sites.map(site => site.hostname);




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
            {...listeners}>{name}</h3>
            <SortableContext id = {id} items={siteIds} strategy={verticalListSortingStrategy}>
            {siteIds.map(hostName => (
                <Task key={hostName} id={hostName} />
            ))}
            </SortableContext>
        </div>
    );
}


export default Group;