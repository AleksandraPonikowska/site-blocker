// fetch data from Chrome storage

(async () => {

  const { blockedSites, rules } = await new Promise((resolve) => {
    chrome.storage.sync.get(
      {
        blockedSites: [],
        rules: [
          {
            id: 0,
            groupId: 0,
            type: 0,
            timeRanges: [{ startTime: "00:00", endTime: "23:59" }],
            days: [true, true, true, true, true, false, false],
          },
        ],
      },
      (result) => resolve(result)
    );
  });

  // get site hostname and find its group (if any)
  const hostname = window.location.hostname;
  const groupId = blockedSites.find(site => site.hostname === hostname)?.groupId;
  if (groupId  === undefined) {
    return;
  }

  // get a date
  const now = new Date();
  const currentDay = (now.getDay() - 1 + 7) % 7;
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // filter rules which apply 
  const activeRules = rules.filter(rule => {
      if (rule.groupId !== groupId) return false;
      if (!rule.days[currentDay]) return false;
      return rule.timeRanges.some(range => {
          const [startHour, startMinute] = range.startTime.split(":").map(Number);
          const [endHour, endMinute] = range.endTime.split(":").map(Number);
          const startTotal = startHour * 60 + startMinute;
          const endTotal = endHour * 60 + endMinute;
          return currentTime >= startTotal && currentTime <= endTotal;
      });
  });

  let maxDelay = 0;


  function applyRules() {
    activeRules.forEach(rule => {
      switch (rule.type){
        case 0:
          console.log("BLOKOWANIE STRONY");
          blockPage();
          break;
        case 1:
          maxDelay = 10;
          console.log("delay")
          
          break;
        case 2:
          // TODO: custom strength
          applyGrayscale(100);
          break;
      }
    });

    if(maxDelay != 0){
      console.log(maxDelay);
          (async () => {
            await delayPage(maxDelay);
          })();
    }



  }

  applyRules();

})();

async function unlockSite(durationSeconds) {
  const now = Date.now();
  const unlockUntil = now + durationSeconds * 1000;

  const { unlockedSites } = await new Promise(resolve => {
    chrome.storage.sync.get({ unlockedSites: [] }, resolve);
  });

  const hostname = window.location.hostname;
  const existingIndex = unlockedSites.findIndex(s => s.hostname === hostname);

  if (existingIndex >= 0) {
    unlockedSites[existingIndex].unlockUntil = unlockUntil;
  } else {
    unlockedSites.push({ hostname, unlockUntil });
  }

  await chrome.storage.sync.set({ unlockedSites });
}


async function isSiteUnlocked() {

  const hostname = window.location.hostname;


  const result = await new Promise(resolve => {
    chrome.storage.sync.get({ unlockedSites: [] }, resolve);
  });

  const unlockedSites = result.unlockedSites;
  const site = unlockedSites.find(site => site.hostname === hostname);

  // site is not unlocked
  if (!site) return false;

  if (Date.now() > site.unlockUntil) {
    // it was unlocked, but is no more
    const newSites = unlockedSites.filter(s => s.hostname !== hostname);
    await chrome.storage.sync.set({ unlockedSites: newSites });
    return false;
  }

  //not on the list

  return true;
}

function createOverlaySkeleton() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "#e1e1e1";
  overlay.style.color = "rgb(36, 36, 36)";
  overlay.style.fontWeight = "500";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.fontFamily = '"Segoe UI", Roboto, Arial, sans-serif';
  overlay.style.zIndex = "999999";

  const message = document.createElement("div");
  message.style.fontSize = "32px";
  message.style.marginBottom = "20px";
  overlay.appendChild(message);

  document.body.appendChild(overlay);

  return { overlay, message };
}

function createOverlay(text) {
  const { message } = createOverlaySkeleton();
  message.textContent = text;
}

async function delayPage(init_seconds) {

  if (await isSiteUnlocked()) return;

  document.documentElement.innerHTML = "";
  window.stop();

  let liczba = init_seconds;
  createOverlay("This site will be unlocked after " + liczba + " seconds");

  const interval = setInterval(async () => {
    if (document.hidden) return;

    liczba--;
    createOverlay("This site will be unlocked after " + liczba + " seconds");

    if (liczba <= 0) {
      clearInterval(interval);
      await unlockSite(10 * 60);
      location.reload();
    }
  }, 1000);
}


function blockPage() {
  document.documentElement.innerHTML = "";
  window.stop();
  const overlay = createOverlay("This site is blocked"); 
}

function applyGrayscale(strength) {
  document.documentElement.style.filter = `grayscale(${strength}%)`;
}