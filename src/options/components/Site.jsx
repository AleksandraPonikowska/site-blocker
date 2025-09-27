import React from 'react';
import "./Site.css"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const Task = ({site, onDelete}) => {

    const {setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: site.hostname,
        data: { type: "site", hostname: site.hostname, groupId: site.groupId },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    if (isDragging) {
        style.opacity = 0.5;
        style.border = "2px dashed gray";
        style.cursor = "grabbing";
    }

    const hostNameDisplay = site.hostname.startsWith("www.")
        ? site.hostname.slice(4)
        : site.hostname;

    return (
        <div 
            ref = {setNodeRef}
            style = {style}
            {...attributes}
            {...listeners}
            className = {"site-container"}>
            <img 
                src={`https://www.google.com/s2/favicons?domain=${site.hostname}&sz=64`}
                alt="favicon" 
            />
            <span>{hostNameDisplay}</span>
            <button onClick={onDelete}>✖</button>
        </div>
    );
}
export default Task;