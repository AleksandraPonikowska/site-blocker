import React from 'react';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task.jsx';
import "./Group.css"

function Group({ sites = [] }) {

    const siteIds = sites.map(site => site.hostname);

    return (
        <div className="group">
            <h3>default</h3>
            <SortableContext items={siteIds} strategy={verticalListSortingStrategy}>
            {siteIds.map(hostName => (
                <Task key={hostName} id={hostName} />
            ))}
            </SortableContext>
        </div>
    );
}


export default Group;