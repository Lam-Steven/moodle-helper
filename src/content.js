console.log("I AM MARCUS!");

const resources = document.getElementsByClassName("activity resource");
const url =
  resources[0].children[0].children[0].children[1].children[0].children[0].href;

const courseName = document.getElementsByClassName("page-header-headings")[0]
  .children[0].innerHTML;

chrome.runtime.sendMessage({ url: url, courseName: courseName });
