const BASE_PATH = "moodle-helper/";

let prefix = "";
let suffix = "";
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  const newfilename = prefix + item.filename + suffix;
  console.log(newfilename);
  suggest({ filename: prefix + item.filename + suffix });
})



chrome.runtime.onMessage.addListener(msg => {
  console.log(msg.url);
  prefix = BASE_PATH + msg.courseName + "/";
  suffix = msg.extension;
  chrome.downloads.download({
    url: msg.url
  });
});

