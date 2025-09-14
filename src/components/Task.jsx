import React from 'react';
import "./Task.css"

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const Task = ({id}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: id});

    const style = {
        transition, 
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref = {setNodeRef} {...attributes} {...listeners} style = {style} className="task">
            {id}
        </div>
    );
}
export default Task;