const BASE_PATH = "moodle-helper/";

const changeBasePath = path =>
  chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
    suggest({ filename: path + "/" + item.filename });
  });

chrome.runtime.onMessage.addListener(msg => {
  console.log(msg.url);

  changeBasePath(BASE_PATH + msg.courseName);
  chrome.downloads.download({
    // url: msg.url
    url:
      // "https://moodle.polymtl.ca/pluginfile.php/59104/mod_resource/content/6/htmlgen/plan_de_cours_INF4705"
      "https://moodle.polymtl.ca/mod/resource/view.php?id=29493&redirect=1"
  });
});
