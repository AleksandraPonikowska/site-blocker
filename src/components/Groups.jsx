import React from 'react';

//import {DndContext} from '@dnd-kit/core';
//            <DndContext collisionDetection={closetsCorners}></DndContext>


function Groups({ groups = [] }) {
    return (
        <div className="blocked-sites">
            <h2>Groups</h2>
            <ul>
                {groups.map((group, index) => (
                    <li key={index}>{group.name} (id: {group.id})</li>
                ))}
            </ul>
        </div>
    );
}


export default Groups;