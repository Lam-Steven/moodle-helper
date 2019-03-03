console.log("popup star", "state:", document.readyState);

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { recipient: "content", start: true });
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == "popup") {
    console.log("download request");
    const item = document.createElement("H1");
    item.innerHTML = msg.url;
    document.body.appendChild(item);
    const button = document.createElement("BUTTON");
    button.innerHTML = "download";
    button.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        recipient: "background",
        url: msg.url,
        courseName: "test",
        extension: ""
      });
    });
    document.body.appendChild(button);
  }
});
