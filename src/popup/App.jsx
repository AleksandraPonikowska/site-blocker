import { useEffect, useState } from 'react';
import useChromeStorage from '../useChromeStorage';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useChromeStorage("blockedSites", []);
const [groups, setGroups] = useChromeStorage("groups", [{id: 0, name: "default"}]);

  const blockCurrentSite = async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.url || !tabs[0].url.startsWith('http')) return;

      const url = new URL(tabs[0].url);
      const hostname = url.hostname;

      if (!blockedSites.map(site => site.hostname).includes(hostname)) {
        const newBlockedSites = [...blockedSites, {hostname: hostname, groupId: 0}];
        await chrome.storage.sync.set({ blockedSites: newBlockedSites });
        setBlockedSites(newBlockedSites);
      }
    } catch (err) {
      console.error('Error blocking site:', err);
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-container">
      <h1>Site Blocker</h1>
      <button onClick={blockCurrentSite}>Block Current Site</button>
      <button onClick={openOptions}>Open Settings</button>
    </div>
  );
}

export default App;
