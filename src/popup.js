console.log("popup star", "state:", document.readyState);

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { recipient: "content", start: true });
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == "popup") {
    console.log("download request");
    const title = document.createElement("h1");
    title.innerHTML = msg.courseName;
    document.body.appendChild(title);
    msg.resources.forEach(resource => {
      const item = document.createElement("H2");
      item.innerHTML = resource.url;
      document.body.appendChild(item);
      const button = document.createElement("BUTTON");
      button.innerHTML = "download";
      button.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          recipient: "background",
          command: "one",
          resource: resource,
          courseName: msg.courseName,
          extension: ""
        });
      });
      document.body.appendChild(button);
    });
    const downloadAllButton = document.createElement("BUTTON");
    downloadAllButton.innerHTML = "download all";
    downloadAllButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        recipient: "background",
        command: "all",
        resources: resources,
        courseName: msg.courseName,
        extension: ""
      });
    });
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(downloadAllButton);
  }
});
