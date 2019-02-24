console.log("test");

let filenames = ["sphere.jpg", "flower.jpg"];

let imgs = document.getElementsByTagName("img");

for (imgElt of imgs) {
  let r = Math.floor(Math.random() * filenames.length);
  let file = "pictures/" + filenames[r];
  let url = chrome.extension.getURL(file);
  imgElt.src = url;
  console.log(url);
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  console.log(message.txt);
}
