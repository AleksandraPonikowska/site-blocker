import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useState([]);

  useEffect(() => {
    const loadBlockedSites = async () => {
      try {
        const data = await chrome.storage.sync.get({ blockedSites: [] });
        setBlockedSites(data.blockedSites);
      } catch (err) {
        console.error("Błąd przy wczytywaniu blockedSites:", err);
      }
    };
    loadBlockedSites();
  }, []);

  const blockCurrentSite = async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.url || !tabs[0].url.startsWith('http')) return;

      const url = new URL(tabs[0].url);
      const hostname = url.hostname;

      if (!blockedSites.includes(hostname)) {
        const newBlockedSites = [...blockedSites, hostname];
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
