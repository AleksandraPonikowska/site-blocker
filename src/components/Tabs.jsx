import { useState, useEffect, use } from "react";
import BlockedSites from "./BlockedSites";
import Groups from "./Groups";

function Tabs() {

    const [activeTab, setActiveTab] = useState(0);

    const [blockedSites, setBlockedSites] = useState([]);
    
      useEffect(() => {
        const loadBlockedSites = async () => {
          try {
            const data = await chrome.storage.sync.get({ blockedSites: [] });
            setBlockedSites(data.blockedSites);
          } catch (err) {
            console.error("Error while loading blockedSites:", err);
          }
        };
        loadBlockedSites();
      }, []);

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await chrome.storage.sync.get({ groups: [] });
                let groups = data.groups;

                if (!groups || groups.length === 0) {
                    console.log("No groups found, creating default group");
                    groups = [{id: 0, name: "default" }]
                    await chrome.storage.sync.set({ groups });
                }
                setGroups(groups);
            } catch (err) {
                console.error("Error while loading groups:", err);
            }
        };
        loadGroups();
    }, []);


    return (
        <div className = "container">
            <div className = "sidebar">
                <div className = "logo">
                    <h1 className = "logo-text"> 🚫 Site Blocker</h1>
                </div>
                
                <div className = "tabs">
                    <div 
                        className = {activeTab == 0 ? "active-tab tab" : "tab"}
                        onClick = {() => setActiveTab(0)}
                        >Blocked Sites</div>
                    <div 
                        className = {activeTab == 1 ? "active-tab tab" : "tab"}
                        onClick = {() => setActiveTab(1)}
                        >Groups</div>
                    <div
                        className = {activeTab == 2 ? "active-tab tab" : "tab"}
                        onClick = {()=> setActiveTab(2)}
                        >Schedule</div>
                </div>
            </div>
            <div className = "main-content">
                <div className = {activeTab == 0 ? "active-content" : "content"}>
                    <h1>Blocked Sites</h1>
                    <Groups groups={groups}></Groups>
                    <BlockedSites sites={blockedSites} />
                </div>
                <div className = {activeTab == 1 ? "active-content" : "content"}> GROUPS CONTENT</div>
                <div className = {activeTab == 2 ? "active-content" : "content"}> SCHEDULE CONTENT</div>
            </div>
        </div>
    )
}
export default Tabs;