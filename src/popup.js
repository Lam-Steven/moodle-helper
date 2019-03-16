chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { recipient: 'content', start: true });
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.recipient == 'popup') {
    const types = new Set();

    const inputs = [];
    let counter = 0;
    const title = document.createElement('H1');
    title.innerHTML = msg.courseName;
    document.body.appendChild(title);

    const checkBoxCounter = document.createElement('H2');
    checkBoxCounter.innerHTML = 'Number of files ' + counter;
    document.body.appendChild(checkBoxCounter);

    const selectAllCheckbox = document.createElement('INPUT');
    const selectAllCheckboxText = document.createElement('H2');
    selectAllCheckboxText.innerHTML = 'Check all';
    selectAllCheckboxText.style.display = 'inline';
    selectAllCheckbox.addEventListener('change', function() {
      selectAllCheckboxes(inputs, this.checked);
    });

    selectAllCheckbox.setAttribute('type', 'checkbox');
    document.body.appendChild(selectAllCheckbox);
    document.body.appendChild(selectAllCheckboxText);

    const filterDiv = document.createElement('DIV');
    document.body.appendChild(filterDiv);

    const allResources = [];
    const selectedResources = [];
    msg.resources.forEach(r => {
      const section = document.createElement('H2');
      section.innerHTML = r.section;
      document.body.appendChild(section);

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
        document.body.appendChild(item);

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
          checkBoxCounter.innerHTML = 'Number of files ' + counter;
        });
        r.checkbox.setAttribute('type', 'checkbox');
        document.body.appendChild(r.checkbox);

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
        document.body.appendChild(button);
      });
    });

    types.forEach(type => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', function() {
        selectByType(allResources, type, this.checked);
      });
      const label = document.createElement('label');
      label.innerHTML = type + 's';
      label.appendChild(checkbox);
      filterDiv.appendChild(label);
    });

    const downloadAllButton = document.createElement('BUTTON');
    downloadAllButton.innerHTML = 'download all';
    downloadAllButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        recipient: 'background',
        command: 'all',
        resources: allResources,
        courseName: msg.courseName,
        extension: '',
      });
    });
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(downloadAllButton);

    const downloadSelectedButton = document.createElement('BUTTON');
    downloadSelectedButton.innerHTML = 'download selected';
    downloadSelectedButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        recipient: 'background',
        command: 'all',
        resources: selectedResources,
        courseName: msg.courseName,
        extension: '',
      });
    });

    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(downloadSelectedButton);
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
