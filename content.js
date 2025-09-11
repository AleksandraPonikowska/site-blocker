const badSites = ["www.facebook.com"];
const url = window.location.hostname;

if (badSites.includes(url)) {

  document.documentElement.innerHTML = `
    <div>
      Zablokowano stronę :3
    </div>
  `;

  window.stop();
}
