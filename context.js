function eventHandler(event) {
  if (event.target.dataset.action == 'create') {
    browser.tabs.create({
      url: 'about:blank',
      cookieStoreId: event.target.dataset.identity
    });
  }
  if (event.target.dataset.action == 'close-all') {
    browser.tabs.query({
      cookieStoreId: event.target.dataset.identity
    }).then((tabs) => {
      browser.tabs.remove(tabs.map((i) => i.id));
    });
  }
  if (event.target.dataset.action == 'show') {
    // console.log(event.target);
    browser.tabs.query({ 
      cookieStoreId: event.target.dataset.identity
    }).then((identities) => {
        const idArray = identities.map((i) => i.id);
        browser.tabs.update(idArray[0], { active: true });
        browser.tabs.query({}).then((tabs) => {
          // console.log(tabs.map((i) => i.id));
          browser.tabs.hide(tabs.map((i) => i.id));
          browser.tabs.show(idArray);
        });
    });
  }
  event.preventDefault();
}

function createOptions(node, identity) {
  for (let option of ['Create', 'Show', 'Close All']) {
    let a = document.createElement('a');
    a.href = '#';
    a.innerText = option;
    a.dataset.action = option.toLowerCase().replace(' ', '-');
    a.dataset.identity = identity.cookieStoreId;
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

      // console.log(identities);

      for (let identity of identities) {
        // console.log(identity);
        let row = document.createElement('div');
        let span = document.createElement('span');
        span.className = 'identity';
        span.innerText = identity.name;
        span.style = `color: ${identity.color}`;
        row.appendChild(span);
        createOptions(row, identity);
        div.appendChild(row);
      }
    });
}
