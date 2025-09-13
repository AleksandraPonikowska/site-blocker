import { useState } from "react";

function Tabs() {

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className = "container">
            <div className = "sidebar">
                meow
                <div className = "tabs">
                    <div 
                        className = {activeTab == 0 ? "active-tab" : "tab"}
                        onClick = {() => setActiveTab(0)}
                        >Blocked Sites</div>
                    <div 
                        className = {activeTab == 1 ? "active-tab" : "tab"}
                        onClick = {() => setActiveTab(1)}
                        >Groups</div>
                    <div
                        className = {activeTab == 2 ? "active-tab" : "tab"}
                        onClick = {()=> setActiveTab(2)}
                        >Schedule</div>
                </div>
            </div>
            <div className = "main-content">
                <div className = {activeTab == 0 ? "active-content" : "content"}> BLOCKED SITES CONTENT</div>
                <div className = {activeTab == 1 ? "active-content" : "content"}> GROUPS CONTENT</div>
                <div className = {activeTab == 2 ? "active-content" : "content"}> SCHEDULE CONTENT</div>
            </div>
        </div>
    )
}
export default Tabs;