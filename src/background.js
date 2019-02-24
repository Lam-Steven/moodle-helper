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
    // url: msg.url
    url: msg.url
    // "https://moodle.polymtl.ca/pluginfile.php/59104/mod_resource/content/6/htmlgen/plan_de_cours_INF4705"
    //"https://moodle.polymtl.ca/mod/resource/view.php?id=29493&redirect=1"
  });
});

