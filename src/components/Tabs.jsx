import { useState} from "react";
import useChromeStorage from "../useChromeStorage";
import BlockedSites from "./BlockedSites";
import Groups from "./Groups";

function Tabs() {

    const [activeTab, setActiveTab] = useState(0);

    const [blockedSites, setBlockedSites] = useChromeStorage("blockedSites", []);
    const [groups, setGroups] = useChromeStorage("groups", [{id: 0, name: "default"}]);
    
    return (
        <div className = "container">
            {blockedSites.length}
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
                    <Groups groups={groups} sites = {blockedSites} setSites = {setBlockedSites}></Groups>
                </div>
                <div className = {activeTab == 1 ? "active-content" : "content"}> GROUPS CONTENT</div>
                <div className = {activeTab == 2 ? "active-content" : "content"}> SCHEDULE CONTENT</div>
            </div>
        </div>
    )
}
export default Tabs;