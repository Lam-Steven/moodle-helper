chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { recipient: 'content', start: true })
})

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'popup') {
    let counter = 0;
    const title = document.createElement('h1')
    title.innerHTML = msg.courseName
    document.body.appendChild(title)

    const checkBoxCounter = document.createElement('H2')
    checkBoxCounter.innerHTML = counter
    document.body.appendChild(checkBoxCounter)
    
    const selectedRessources = [];
    msg.resources.forEach(resource => {
      const item = document.createElement('H2')
      item.innerHTML = resource.url
      document.body.appendChild(item)

      const checkbox = document.createElement("INPUT");
      checkbox.addEventListener('change', function() {
        if(this.checked){
          counter += 1;
          selectedRessources.push(resource);
        }
        else{
          counter -= 1;
          const index = selectedRessources.indexOf(resource);
          selectedRessources.splice(index, 1);
        }
        checkBoxCounter.innerHTML = counter;
        console.log(selectedRessources.length);
      })
      checkbox.setAttribute("type", "checkbox");
      document.body.appendChild(checkbox);
      
      const button = document.createElement('BUTTON')
      button.innerHTML = 'download'
      button.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          recipient: 'background',
          command: 'one',
          resource: resource,
          courseName: msg.courseName,
          extension: '',
        })
      })
      document.body.appendChild(button)
    })
    const downloadAllButton = document.createElement('BUTTON')
    downloadAllButton.innerHTML = 'download all'
    downloadAllButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        recipient: 'background',
        command: 'all',
        resources: msg.resources,
        courseName: msg.courseName,
        extension: '',
      })
    })
    document.body.appendChild(document.createElement('br'))
    document.body.appendChild(document.createElement('br'))
    document.body.appendChild(downloadAllButton)

    const downloadSelectedButton = document.createElement('BUTTON')
    downloadSelectedButton.innerHTML = 'download selected'
    downloadSelectedButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        recipient: 'background',
        command: 'all',
        resources: selectedRessources,
        courseName: msg.courseName,
        extension: '',
      })
    })
    document.body.appendChild(document.createElement('br'))
    document.body.appendChild(downloadSelectedButton)
  }
})
