import React from 'react';

function BlockedSites({sites = []}) {
    return (
        <div className = "blocked-sites">
            <h2>Blocked Sites</h2>
            <ul>
                {sites.map((site, index) => (
                    <li key={index}>{site.hostname} (group id: {site.group})</li>
                ))}
            </ul>
        </div>
    )
}

export default BlockedSites;