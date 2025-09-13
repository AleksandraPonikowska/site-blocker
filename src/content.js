console.log("Odpada się content.ts")

chrome.storage.sync.get({ blockedSites : [] })
  .then((data) => {
    const badSites = data.blockedSites;
    const url = window.location.hostname;
    if (badSites.includes(url)) {

      document.documentElement.style.filter = "grayscale(100%)";
      


return;

    document.documentElement.innerHTML = `
      <style>

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        body {
          display: flex; 
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #e1e1e1ff;
          color: #626262ff;
          font-family: Arial, sans-serif;
          text-align: center;
          box-sizing: border-box;
        }

        h2 {
          font-size: 2em;
          margin: 0;
          font-weight: 600;
        }

      </style>
      <h1>This site is blocked</h1>
    `;

  //window.stop();
  }
  });