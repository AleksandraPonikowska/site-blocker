const RULE_TYPES = {
  BLOCK: 0,
  DELAY: 1,
  GRAYSCALE: 2
}

const UPDATE_INTERVAL_MINUTES = 1;

let applicableRules = [];
let groupId = 0;

let overlayState = {
  node: null,
  messageEl: null
};

async function fetchAllData() {
  return new Promise((resolve) => {
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
            greyStrength: 50,
            delaySeconds: 10,
            unblockAfterMinutes: 10
          },
        ],
      },
      (result) => resolve(result)
    );
  });
}

async function updateApplicableData(){
  const {blockedSites, rules} = await fetchAllData();

  const hostname = window.location.hostname;
  groupId = blockedSites.find(site => site.hostname === hostname)?.groupId;
  if (groupId  === undefined) {
    return;
  }

  applicableRules = rules.filter((rule) => rule.groupId == groupId);
}

function getDate(){
  const now = new Date();
  const currentDay = (now.getDay() - 1 + 7) % 7;
  const currentTime = now.getHours() * 60 + now.getMinutes();
  return {currentDay, currentTime}
}

function isRangeActive(range, currentTime){
  const [startHour, startMinute] = range.startTime.split(":").map(Number);
  const [endHour, endMinute] = range.endTime.split(":").map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  return currentTime >= startTotal && currentTime <= endTotal;
}

function getActiveRules(currentDay, currentTime){
  return applicableRules.filter(rule =>{
    if (!rule.days[currentDay]) return false;
    return rule.timeRanges.some(range => isRangeActive(range, currentTime))
  })
}

function createOrUpdateOverlay(text){
  if(!overlayState.node){
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

    overlayState.node = overlay;
    overlayState.messageEl = message;
  }
  
  overlayState.messageEl.textContent = text;
}

async function getUnlocked(){
  return new Promise(resolve => {
    chrome.storage.sync.get({ unlockedSites: [] }, (res) => resolve(res.unlockedSites));
  });
}

async function setUnlocked(unlockedSites){
  await chrome.storage.sync.set({ unlockedSites });
}

async function unlockSite(durationMinutes) {
  const hostname = window.location.hostname;
  const now = Date.now();
  const unlockUntil = now + durationMinutes * 60 * 1000;

  const unlocked = await getUnlocked();
  const existingIndex = unlocked.findIndex(s => s.hostname === hostname);

  if (existingIndex >= 0) {
    unlocked[existingIndex].unlockUntil = unlockUntil;
  } else {
    unlocked.push({ hostname, unlockUntil });
  }

  await setUnlocked(unlocked);
  console.log(`Site unlocked until ${new Date(unlockUntil).toLocaleString()}`);
}

async function isSiteUnlocked() {
  const hostname = window.location.hostname;
  const unlocked = await getUnlocked();
  const site = unlocked.find(site => site.hostname === hostname);

  if (!site) {
    return false;
  }

  if (Date.now() > site.unlockUntil) {
    const newUnlocked = unlocked.filter(s => s.hostname !== hostname);
    await setUnlocked(newUnlocked);
    return false;
  }

  return true;
}

async function applyActiveRules(){
  if (document.hidden) return;

  const { currentDay, currentTime } = getDate();
  const active = getActiveRules(currentDay, currentTime);

  const isBlocked = active.some(rule => rule.type === RULE_TYPES.BLOCK);
  if (isBlocked){
    document.documentElement.innerHTML = '';
    window.stop();
    createOrUpdateOverlay("This site is blocked");
    return;
  }

  const delayRules = active.filter(rule => rule.type === RULE_TYPES.DELAY);
  if (delayRules.length > 0){
    const maxDelay = Math.max(...delayRules.map(rule => (rule.delaySeconds || 10)));
    const minUnlock = Math.min(...delayRules.map(rule => (rule.unblockAfterMinutes || 10)));

    UPDATE_INTERVAL_MINUTES = Math.min(1, minUnlock * 1.01);

    if (!(await isSiteUnlocked())) {
      document.documentElement.innerHTML = "";
      window.stop();
      let remaining = maxDelay;
      createOrUpdateOverlay("This site will be unlocked after " + remaining + " seconds");
      
      const t = setInterval(async () => {
        if (document.hidden) return;
        remaining--;
        createOrUpdateOverlay("This site will be unlocked after " + remaining + " seconds");
        
        if (remaining <= 0) {
          clearInterval(t);
          await unlockSite(minUnlock);
          await new Promise(resolve => setTimeout(resolve, 100));
          location.reload();
        }
      }, 1000);
    }
    return;
  }

  const grayRules = active.filter(rule => rule.type === RULE_TYPES.GRAYSCALE);
  if (grayRules.length > 0){
    const maxStrength = Math.max(...grayRules.map(rule => (rule.greyStrength || 100)));
    document.documentElement.style.filter = `grayscale(${maxStrength}%)`;
    return;
  }
}

(async function init(){
  await updateApplicableData();
  await applyActiveRules();
})();

setInterval(async () => {
  await applyActiveRules();
}, UPDATE_INTERVAL_MINUTES * 60 * 1000);


