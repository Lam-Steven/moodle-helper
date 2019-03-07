const ILLEGAL_CHARACTERS = /[*?"<>|\\\/:]/g;

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'content' && msg.start) {
    const resources = document.getElementsByClassName('activity resource')
    const resourcesArray = []

    Array.prototype.forEach.call(resources, resource => {
      const anchorTag =
        resource.children[0].children[0].children[1].children[0].children[0]
      const nameTag = anchorTag.children[1]
      const iconTag = anchorTag.children[0]

      resourcesArray.push({
        iconUrl: iconTag.src,
        url: isWindowOpen(anchorTag) ? getDownloadURL(anchorTag) : anchorTag.href,
        name: nameTag.innerHTML
      })
    })

    chrome.runtime.sendMessage({
      recipient: 'popup',
      resources: resourcesArray,
      courseName: getCourseName()
    })
  }
})

function isWindowOpen(a) {
  return (
    a.hasAttribute('onclick') &&
    a.getAttribute('onclick').indexOf('window.open') > -1
  )
}

function getDownloadURL(anchorTag) {
  const s = anchorTag.getAttribute('onclick')
  const first = s.indexOf("'") + 1
  const second = s.indexOf("'", first) 
  return s.substring(first, second)
}

function getSchool() {
  const schoolURL = document.getElementsByTagName('link')[0].getAttribute('href');
  const end = schoolURL.indexOf(".ca") 
  const start = schoolURL.lastIndexOf('.', end - 1) + 1
  return schoolURL.substring(start, end)
}

function getCourseName() {
  let courseName = '';
  switch (getSchool()) {
    case('polymtl') :
      courseName = document.getElementsByClassName('page-header-headings')[0].children[0].innerHTML
      break;
    case('uqam') :
      courseName = document.getElementsByClassName('titre-cours')[0].innerHTML;
      break;
  }
  return courseName.replace(ILLEGAL_CHARACTERS, '').trim();
}