function getChromeStorage(key, defaultValue) {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [key]: defaultValue }, (result) => {
      resolve(result[key]);
    });
  });
}

(async () => {
  console.log("Odpada się content.ts");

  const { blockedSites, groups, rules } = await new Promise((resolve) => {
    chrome.storage.sync.get(
      {
        blockedSites: [],
        groups: [{ id: 0, name: "default" }],
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

  console.log("Blocked Sites:", blockedSites);
  console.log("Groups:", groups);

  const hostname = window.location.hostname;
  const groupId = blockedSites.find(site => site.hostname === hostname).groupId;
  const now = new Date();
  const currentDay = (now.getDay() - 1 + 7) % 7;
  const currentTime = now.getHours() * 60 + now.getMinutes();

  console.log("Current Hostname:", hostname);
  console.log("Group ID:", groupId);
  console.log("Current Day:", currentDay);
  console.log("Current Time (in minutes):", currentTime);

  const currentRules = rules.filter(rule => {
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

  console.log("Current Rules:", currentRules);

  function applyRules() {
    currentRules.forEach(rule => {
      if (rule.type === 2 && document.body) {
        document.documentElement.style.filter = "grayscale(100%)";
      }
    });
  }

  if (true) {
    applyRules();
  } else {
    document.addEventListener("DOMContentLoaded", applyRules);
  }

})();
