const BASE_PATH = "moodle-helper/";

let prefix = "";
let suffix = "";
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  if(item.filename.indexOf(".") > -1) {
    suffix = "";
  }
  suggest({ filename: prefix + item.filename + suffix });
})


chrome.runtime.onMessage.addListener(msg => {
  prefix = BASE_PATH + msg.courseName + "/";
  suffix = msg.extension;
  chrome.downloads.download({
    url: msg.url
  });
});

