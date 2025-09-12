import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [blockedSites, setBlockedSites] = useState([]);

  // Wczytywanie listy z storage przy starcie
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

  // Funkcja dodająca bieżącą stronę
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

  return (
    <div className="popup-container">
      <h1>Site Blocker</h1>
      <button onClick={blockCurrentSite}>Block Current Site</button>
      <h2>Blocked Sites:</h2>
      <ul>
        {blockedSites.map(site => (
          <li key={site}>{site}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
