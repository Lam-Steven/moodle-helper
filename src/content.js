console.log("I AM MARCUS!");
let extension = "";

const resources = document.getElementsByClassName("activity resource");
const anchorTag = resources[0].children[0].children[0].children[1].children[0].children[0];

let url = anchorTag.href;
if (isWindowOpen(anchorTag)) {

  extension = ".pdf";
  console.log("marcus");
  const s = anchorTag.getAttribute("onclick");
  const first = s.indexOf('\'') + 1;
  const second = s.indexOf('\'', first);
  url = s.substring(first, second);

}

const baseCourseName = document.getElementsByClassName("page-header-headings")[0]
  .children[0].innerHTML;

const courseName = baseCourseName.replace(/[*?"<>|\\\/:]/g, "").trim();
chrome.runtime.sendMessage({ recipient: "popup", url: url, courseName: courseName, extension: extension });


function isWindowOpen(a) {

  console.log(a.getAttribute("onclick"), a.getAttribute("onclick").indexOf("window.open"));
  return a.hasAttribute("onclick") && a.getAttribute("onclick").indexOf("window.open") > -1;
}
