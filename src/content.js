function getChromeStorage(key, defaultValue) {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [key]: defaultValue }, (result) => {
      resolve(result[key]);
    });
  });
}

(async () => {
  console.log("Odpada się content.ts");

  const blockedSites = await getChromeStorage("blockedSites", []);
  const groups = await getChromeStorage("groups", [{ id: 0, name: "default" }]);
  const rules = await getChromeStorage("rules", [{
      id: 0,
      groupId: 0,
      type: 0,
      timeRanges: [{ startTime: "00:00", endTime: "23:59" }],
      days: [true, true, true, true, true, false, false]
  }]);

  const hostname = window.location.hostname;
  const thisSite = blockedSites.find(site => site.hostname === hostname);
  const group = groups.find(g => g.id === thisSite?.groupId) || -1;
  const now = new Date();
  const currentDay = (now.getDay() - 1 + 7) % 7;
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const currentRules = rules.filter(rule => {
      if (rule.groupId !== group.id) return false;
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
        document.body.style.filter = "grayscale(100%)";
      }
    });
  }

  if (document.body) {
    applyRules();
  } else {
    document.addEventListener("DOMContentLoaded", applyRules);
  }

})();
