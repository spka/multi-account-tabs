function eventHandler(event) {

  // console.log(event.target.dataset.tabs);

  if(event.target.dataset.tabs == 'false') {
    browser.tabs.create({
      // url: 'about:blank',
      cookieStoreId: event.target.dataset.identity,
      // active: true
    });
    event.target.dataset.tabs = 'true';
  }

  // if (event.target.dataset.action == 'remove') {
  //   browser.tabs.query({
  //     cookieStoreId: event.target.dataset.identity
  //   }).then((tabs) => {
  //     browser.tabs.remove(tabs.map((i) => i.id));
  //   });
  // }

  onlyShowIdentity(event.target.dataset.identity);
  event.preventDefault();
}

function onlyShowIdentity(identity) {
  browser.tabs.query({ 
    cookieStoreId: identity
  }).then((identities) => {
      const idArray = identities.map((i) => i.id);
      browser.tabs.update(idArray[0], { active: true });
      browser.tabs.query({}).then((tabs) => {
        // let newArray = [];
        // for (let tab of tabs.map((i) => i.id)) {
        //   if(!idArray.includes(tab)) {
        //     newArray.push(tab);
        //   }
        // }
        browser.tabs.hide(tabs.map((i) => i.id));
        browser.tabs.show(idArray);
      });
  });
}

function createOptions(node, identity) {
  for (let option of ['Create', 'Show']) {
    let a = document.createElement('a');
    a.href = '#';
    a.innerText = option;
    a.dataset.action = option.toLowerCase().replace(' ', '-');
    a.dataset.identity = identity.cookieStoreId;
    a.dataset.currentTabs = identity.currentTabs;
    a.addEventListener('click', eventHandler);
    node.appendChild(a);
  }
}

let div = document.getElementById('identity-list');

if (browser.contextualIdentities === undefined) {
  div.innerText = 'browser.contextualIdentities not available. Check that the privacy.userContext.enabled pref is set to true, and reload the add-on.';
} else {
  browser.contextualIdentities.query({})
    .then((identities) => {
      if (!identities.length) {
        div.innerText = 'No identities returned from the API.';
        return;
      }
      // default identity
      identities.unshift({
          "name": "Tabs",
          "icon": "Blocks",
          "iconUrl": "img/multiaccountcontainertabs-16.svg",
          "color": "white",
          "colorCode": "#ffffff",
          "cookieStoreId": "firefox-default"
      });
      console.log(identities);

      for (let identity of identities) {
        // check if no tabs for an identity yet
        browser.tabs.query({ 
          cookieStoreId: identity.cookieStoreId
        }).then((list) => {
          identity.currentTabs = list.length > 0 ? true : false;
          let row = document.createElement('div');
          let img = document.createElement('span');
          let span = document.createElement('span');
          span.className = 'identity';
          span.innerText = identity.name;
          span.style = `color: ${identity.colorCode};`;
          span.dataset.identity = identity.cookieStoreId;
          span.dataset.tabs = identity.currentTabs;
          // img.src = `${identity.iconUrl}`;
          // img.id = identity.cookieStoreId;
          img.className = 'test';
          img.style = `mask-repeat: no-repeat; mask-image: url(${identity.iconUrl}); background-color: ${identity.colorCode};`
          span.addEventListener('click', eventHandler);
          span.prepend(img);
          row.appendChild(span);
          // createOptions(row, identity);
          div.appendChild(row);
          console.log(document.querySelector("#firefox-container-1"));
        });
      }
    });
}

// set theme
// function getTheme(currentTheme, window) {
//   if (typeof currentTheme !== "undefined" && currentTheme !== "auto") {
//     return currentTheme;
//   }
//   if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//     return "dark";
//   }
//   return "light";
// }

// browser.storage.local.get("currentTheme")
//   .then((currentTheme) => {
//     const popup = document.getElementsByTagName("html")[0];
//     // const theme = getTheme(currentTheme, window);
//     // console.log(JSON.parse(JSON.stringify(currentTheme)));
//     if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//       // return "dark";
//       popup.setAttribute("data-theme", "dark");
//     }
//     // return "light";
//     popup.setAttribute("data-theme", "light");
//   });

const popup = document.getElementsByTagName("html")[0];
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  popup.setAttribute("data-theme", "dark");
} else {
  popup.setAttribute("data-theme", "light");
}

// document.querySelector("#settings").addEventListener('click', () => {
//   // browser.runtime.openOptionsPage();
//   // browser.tabs.create({url: "about:preferences"});
//   browser.tabs.create({
//     url: "about:preferences",
//   });
// });
