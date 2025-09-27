import { useEffect, useState } from 'react';
import useChromeStorage from '../useChromeStorage';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useChromeStorage("blockedSites", []);
  const [currentHostname, setCurrentHostname] = useState('');

  useEffect(() => {
    const fetchHostname = async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url?.startsWith('http')) {
          const url = new URL(tabs[0].url);
          setCurrentHostname(url.hostname);
        }
      } catch (err) {
        console.error('Error fetching current hostname:', err);
      }
    };
    fetchHostname();
  }, []);

  const blockCurrentSite = () => {
    console.log(currentHostname);
    if (!currentHostname) return;

    if (!blockedSites.some(site => site.hostname === currentHostname)) {
      const newBlockedSites = [...blockedSites, { hostname: currentHostname, groupId: 0 }];
      setBlockedSites(newBlockedSites);
    }
  };

  const openOptions = () => chrome.runtime.openOptionsPage();

  const isBlocked = blockedSites.some(site => site.hostname === currentHostname);

  return (
    <div className="popup-container">
      <div className="logo">
        <h1 className="logo-text">🚫 Site Blocker</h1>
      </div>
      <div className="buttons">
        <button onClick={blockCurrentSite} disabled={isBlocked}>
          {isBlocked ? 'This site is blocked' : 'Block this site'}
        </button>
        <button onClick={openOptions}>Open settings</button>
      </div>
    </div>
  );
}

export default App;
