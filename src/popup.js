chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { recipient: 'content', start: true });
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'popup') {
    const types = new Set();
    const inputs = [];
    const allResources = [];
    const selectedResources = [];
    let counter = 0;
    
    const checkBoxCounter = document.getElementById('counter');
    const contentDiv = document.getElementById('content');

    msg.resources.forEach(r => {
      const section = document.createElement('H2');
      section.innerHTML = r.section;
      contentDiv.appendChild(section);

      r.resources.forEach(r => {
        allResources.push(r);
        const icon = document.createElement('img');
        icon.src = r.iconUrl;
        r.fileType = r.iconUrl
          .split('/')
          .pop()
          .split('-')[0];

        types.add(r.fileType);

        icon.style.display = 'block';

        const item = document.createElement('H4');
        item.innerHTML = r.name;
        item.appendChild(icon);
        contentDiv.appendChild(item);

        r.checkbox = document.createElement('INPUT');
        inputs.push(r.checkbox);
        r.checkbox.addEventListener('change', function() {
          if (this.checked) {
            counter += 1;
            selectedResources.push(r);
          } else {
            counter -= 1;
            const index = selectedResources.indexOf(r);
            selectedResources.splice(index, 1);
          }
          checkBoxCounter.innerHTML = 'Number of files : ' + counter;
        });
        r.checkbox.setAttribute('type', 'checkbox');
        contentDiv.appendChild(r.checkbox);

        const button = document.createElement('BUTTON');
        button.innerHTML = 'download';
        button.addEventListener('click', () => {
          chrome.runtime.sendMessage({
            recipient: 'background',
            command: 'one',
            resource: r,
            courseName: msg.courseName,
            extension: '',
          });
        });
        contentDiv.appendChild(button);
      });
      
    });
    initializeHeader(msg.courseName, inputs, types, selectedResources, allResources)
  }
});

function selectAllCheckboxes(inputs, isChecked) {
  inputs.forEach(element => {
    if (element.checked != isChecked) {
      element.checked = isChecked;
      element.dispatchEvent(new Event('change'));
    }
  });
}

function selectByType(resources, type, isChecked) {
  resources.forEach(resource => {
    const checkbox = resource.checkbox;
    if (resource.fileType == type && checkbox.checked != isChecked) {
      checkbox.checked = isChecked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
}

function initializeHeader(courseName, inputs, types, selectedResources, allResources) {
  
  document.getElementById('courseName').innerHTML = courseName;
  
  document.getElementById('selectAll').addEventListener('change', function() {
    selectAllCheckboxes(inputs, this.checked);
  });

  getFilters(types, allResources, document.getElementById('filters'));
  setDownloadButton(selectedResources, courseName);
}

function getFilters(types, resources, filters){
  types.forEach(type => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
      selectByType(resources, type, this.checked);
    });

    const label = document.createElement('label');
    label.innerHTML = type + 's';
    label.style.display = 'block';

    label.prepend(checkbox);
    filters.appendChild(label);
  });
}

function setDownloadButton(resources, courseName) {
  const downloadSelectedButton = document.getElementById('download');
  downloadSelectedButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      recipient: 'background',
      command: 'all',
      resources: resources,
      courseName: courseName,
      extension: '',
    });
  });
}