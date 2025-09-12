const blockButton = document.getElementById('blockButton');
const blockedSitesList = document.getElementById('blockedSitesList');

function renderBlockedSites(sites) {
    blockedSitesList.innerHTML = ''; 
    sites.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        blockedSitesList.appendChild(li);
    });
}

chrome.storage.sync.get({ blockedSites: [] })
    .then((data) => {
        renderBlockedSites(data.blockedSites);
    })
    .catch(err => console.error(err));

blockButton.addEventListener('click', async () => {
    try {

        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const activeTabUrl = tabs[0].url; // np. "https://www.youtube.com/"
        const url = new URL(activeTabUrl); // teraz poprawnie parsuje URL
        const hostname = url.hostname;     // np. "www.youtube.com"


        const data = await chrome.storage.sync.get({ blockedSites: [] });
        const badSites = data.blockedSites;

        if (!badSites.includes(hostname)) {
            badSites.push(url.hostname);
            await chrome.storage.sync.set({ blockedSites: badSites });
            renderBlockedSites(badSites);
        }

    } catch (error) {
        console.error('Error blocking site:', error);
    }
});
