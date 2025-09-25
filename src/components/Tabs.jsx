import { useState} from "react";
import useChromeStorage from "../useChromeStorage";
import BlockedSites from "./BlockedSites";
import Groups from "./Groups";
import Rules from "./Rules";

function Tabs() {

    const [activeTab, setActiveTab] = useState(0);

    const [blockedSites, setBlockedSites] = useChromeStorage("blockedSites", []);
    const [groups, setGroups] = useChromeStorage("groups", [{id: 0, name: "default"}]);
    const [rules, setRules] = useChromeStorage("rules", [{
        id: 0,
        groupId: 0,  
        type: 0,
        timeRanges: [
            {startTime: "00:00", endTime: "23:59"}
        ],
        days: [true, true, true, true, true, false, false]
    }]);


    
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
                        >Schedule</div>
                </div>
            </div>
            <div className = "main-content">
                <div className = {activeTab == 0 ? "active-content" : "content"}>
                    <h1>Blocked Sites</h1>
                    <Groups initialGroups={groups} sites = {blockedSites} setSites = {setBlockedSites} setGlobalGroups = {setGroups}></Groups>
                </div>
                <div className = {activeTab == 1 ? "active-content" : "content"}> 
                    <Rules groups={groups} rules={rules} setRules ={setRules}></Rules>
                </div>
            </div>
        </div>
    )
}
export default Tabs;