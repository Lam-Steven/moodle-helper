const BASE_PATH = 'moodle-helper/'

let prefix = ''

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'background') {
    prefix = BASE_PATH + msg.courseName + '/'
    if (msg.command == 'one') downloadFile(msg.resource)
    if (msg.command == 'all') downloadFiles(msg.resources)
  }
})

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  if(item.filename == "view.html") {
    downloadFromFrame(item)
    chrome.downloads.cancel(item.id)
  }
  const suffix = isPDF(item) && !hasExtension(item.filename) ? '.pdf' : ''

  suggest({ filename: prefix + item.filename + suffix })
})


function downloadFiles(resources) {
  Array.prototype.forEach.call(resources, downloadFile)
}

function downloadFile(resource) {
  chrome.downloads.download({
    url: resource.url,
  })
}

function isPDF(item) {
  return item.mime == 'application/pdf'
}

function hasExtension(fileName) {
  return fileName.indexOf('.') > -1
}

function downloadFromFrame(item) {
  fetch(item.url).then((data) => {
    return data.text();
  })
  .then( (text) => {
    const anchor = "frame src="
    const offset = anchor.length + 1
    const first = text.indexOf(anchor, text.indexOf(anchor) + offset)
    
    if (first > -1) {
      const second = text.indexOf("\"", first + offset)
      const url = text.substring(first + offset, second)
      downloadFile({url: url})
    }
  });
}