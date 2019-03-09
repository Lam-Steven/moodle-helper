chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { recipient: 'content', start: true })
})

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'popup') {
    const inputs = [];
    let counter = 0;
    const title = document.createElement('H1')
    title.innerHTML = msg.courseName
    document.body.appendChild(title)

    const checkBoxCounter = document.createElement('H2')
    checkBoxCounter.innerHTML = 'Nombre de fichiers: ' + counter
    document.body.appendChild(checkBoxCounter)

    const selectAllCheckbox = document.createElement('INPUT')
    const selectAllCheckboxText = document.createElement('H2')
    selectAllCheckboxText.innerHTML = 'Check all'
    selectAllCheckboxText.style.display = 'inline'
    selectAllCheckbox.addEventListener('change', function(){
        selectAllCheckboxes(inputs, this.checked)       
    })
    
    selectAllCheckbox.setAttribute("type", "checkbox");
    document.body.appendChild(selectAllCheckbox)
    document.body.appendChild(selectAllCheckboxText)
    
    const selectedRessources = [];
    msg.resources.forEach(r => {
      const section = document.createElement('H2')
      section.innerHTML = r.section
      document.body.appendChild(section)

      r.resources.forEach(r => {
        const icon = document.createElement('img')
        icon.src = r.iconUrl;
        icon.style.display = 'block'
        
        const item = document.createElement('H4')
        item.innerHTML = r.name
        item.appendChild(icon)
        document.body.appendChild(item)
        
        const checkbox = document.createElement("INPUT");
        inputs.push(checkbox);
        checkbox.addEventListener('change', function() {
          if(this.checked){
            counter += 1;
            selectedRessources.push(r);
          }
          else{
            counter -= 1;
            const index = selectedRessources.indexOf(r);
            selectedRessources.splice(index, 1);
          }
          checkBoxCounter.innerHTML ='Nombre de fichiers: ' +  counter;
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
            resource: r,
            courseName: msg.courseName,
            extension: '',
          })
        })
        document.body.appendChild(button)
      })
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

function selectAllCheckboxes (inputs, isChecked) {
  inputs.forEach((element) => {
    if(element.checked != isChecked){
      element.checked = isChecked;
      element.dispatchEvent(new Event('change'));
    }
  })
}