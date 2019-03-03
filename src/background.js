const BASE_PATH = "moodle-helper/";

let prefix = "";
let extension = "";

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == "background") {
    console.log(msg.extension);
    prefix = BASE_PATH + msg.courseName + "/";
    extension = msg.extension;
    chrome.downloads.download({
      url: msg.url
    });
  }
});

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  console.log(item);
  const suffix = hasExtension(item.fileName) ? "" : extension;
  suggest({ filename: prefix + item.filename + suffix });
});

function hasExtension(fileName) {
  return fileName.indexOf(".") > -1;
}
