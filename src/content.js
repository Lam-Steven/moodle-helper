console.log("I AM MARCUS!");

const resources = document.getElementsByClassName("activity resource");
console.log(resources[0]);
const url =
  resources[0].children[0].children[0].children[1].children[0].children[0].href;
console.log(url);

const courseName = document.getElementsByClassName("page-header-headings")[0]
  .children[0].innerHTML;

chrome.runtime.sendMessage({ url: url, courseName: courseName });
