const BASE_PATH = "moodle-helper/";

const changeBasePath = path =>
  chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
    suggest({ filename: path + "/" + item.filename });
  });

chrome.runtime.onMessage.addListener(msg => {
  console.log(msg.url);

  changeBasePath(BASE_PATH + msg.courseName);
  chrome.downloads.download({
    url: msg.url
  });
});
