import React from 'react';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task.jsx';
import "./Group.css"

function Group({ id, name, sites = [], onDelete = () => {} }) {

    const siteIds = sites.map(site => site.hostname);

    return (
        <div className="group">

            { id !== 0 && (
            <button
                className="button-delete"
                onClick={() => onDelete(id)}
            >
                ✖
            </button>
            )}


            <h3>{name}</h3>
            <SortableContext id = {id} items={siteIds} strategy={verticalListSortingStrategy}>
            {siteIds.map(hostName => (
                <Task key={hostName} id={hostName} />
            ))}
            </SortableContext>
        </div>
    );
}


export default Group;