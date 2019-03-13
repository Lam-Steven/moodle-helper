const ILLEGAL_CHARACTERS = /[*?"<>|\\\/:]/g

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'content' && msg.start) {
    const sections = document.getElementsByClassName('section main clearfix')
    let allResources = []

    Array.prototype.forEach.call(sections, s => {
      if (!isHidden(s)) {
        const resources = getResources(s)
        const resourcesArray = []

        Array.prototype.forEach.call(resources, resource => {
          if (isActivityResource(resource)) {
            const anchorTag =
              resource.children[0].children[0].children[1].children[0]
                .children[0]
            const nameTag = anchorTag.children[1]
            const iconTag = anchorTag.children[0]
            resourcesArray.push({
              iconUrl: iconTag.src,
              url: isWindowOpen(anchorTag)
                ? getDownloadURL(anchorTag)
                : anchorTag.href,
              name: nameTag.innerHTML,
            })
          }
        })
        allResources.push({
          section: s.getAttribute('aria-label'),
          resources: resourcesArray,
        })
      }
    })
    chrome.runtime.sendMessage({
      recipient: 'popup',
      resources: allResources,
      courseName: getCourseName(),
    })
  }
})

function isHidden(s) {
  return s.getAttribute('class') == 'section main clearfix hidden'
}

function isActivityResource(r) {
  if (r.hasAttribute('class')) {
    return r.getAttribute('class').includes('activity resource')
  }
  return false
}

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
  const schoolURL = window.location.href
  const end = schoolURL.indexOf('.ca')
  const start = schoolURL.lastIndexOf('.', end - 1) + 1
  return schoolURL.substring(start, end)
}

function getResources(s) {
  switch (getSchool()) {
    case 'polymtl':
      return s.children[3].children[3].children
    case 'uqam':
      return s.children[2].children[1].children[0].children
  }
}

function getCourseName() {
  let courseName = ''
  switch (getSchool()) {
    case 'polymtl':
      courseName = document.getElementsByClassName('page-header-headings')[0]
        .children[0].innerHTML
      break
    case 'uqam':
      courseName = document.getElementsByClassName('titre-cours')[0].innerHTML
      break
  }
  return courseName.replace(ILLEGAL_CHARACTERS, '').trim()
}
