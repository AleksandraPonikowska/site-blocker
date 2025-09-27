// fetch data from Chrome storage

(async () => {

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


  function applyRules() {
    activeRules.forEach(rule => {
      switch (rule.type){
        case 0:
          // TODO: add nice overlay
          blockPage();
          break;
        case 2:
          // TODO: custom strength
          applyGrayscale(50);
          break;
      }
    });
  }

  applyRules();

})();

function blockPage(){
  document.documentElement.innerHTML = "elo"
  window.stop();
} 

function applyGrayscale(strength){
  document.documentElement.style.filter = `grayscale(${strength}%)`;
}
