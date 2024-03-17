browser.tabs.onCreated.addListener((tab) => {
    console.log(tab);
});

// browser.runtime.onInstalled.addListener(() => {
//     browser.contextMenus.create({
//         id: "sampleContextMenu",
//         title: "Sample Context Menu",
//         contexts: ["selection"],
//     });
// });