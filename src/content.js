chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'content' && msg.start) {
    const resources = document.getElementsByClassName('activity resource')
    const resourcesArray = []

    Array.prototype.forEach.call(resources, resource => {
      const anchorTag =
        resource.children[0].children[0].children[1].children[0].children[0]
      const nameTag = anchorTag.children[1]
      let url = anchorTag.href
      let extension = ''

      if (isWindowOpen(anchorTag)) {
        extension = '.pdf'
        const s = anchorTag.getAttribute('onclick')
        const first = s.indexOf("'") + 1
        const second = s.indexOf("'", first)
        url = s.substring(first, second)
      }

      resourcesArray.push({
        url: url,
        name: nameTag.innerHTML,
        extension: extension,
      })
    })

    const courseNameHTML = document.getElementsByClassName(
      'page-header-headings'
    )[0].children[0].innerHTML
    const courseName = courseNameHTML.replace(/[*?"<>|\\\/:]/g, '').trim()

    chrome.runtime.sendMessage({
      recipient: 'popup',
      resources: resourcesArray,
      courseName: courseName,
    })
  }
})

function isWindowOpen(a) {
  return (
    a.hasAttribute('onclick') &&
    a.getAttribute('onclick').indexOf('window.open') > -1
  )
}
