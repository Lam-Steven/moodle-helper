const BASE_PATH = "moodle-helper/";

let prefix = "";
let extension = "";

chrome.runtime.onMessage.addListener(msg => {

  prefix = BASE_PATH + msg.courseName + "/";
  downloadFiles(msg.resources);
});

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {

  const suffix = hasExtension(item.filename) ? "" : extension;
  suggest({ filename: prefix + item.filename + suffix });
})

function downloadFiles(resources) {

  Array.prototype.forEach.call(resources, (resource) => { 
    extension = resource.extension;
    chrome.downloads.download({
      url: resource.url
    });
  })
}

function hasExtension(fileName) {
  
  return fileName.indexOf(".") > -1;
}
