// Get the device list from the background page.
document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getDeviceList' }, function(response) {
            // Get a reference to the device list dropdown.
            var deviceList = document.getElementById('deviceList');
        
            // Populate the device list dropdown with the available devices.
            response.forEach(function(device) {
                var option = document.createElement('option');
                option.value = device.deviceId;

                let textLabel = getTextGroupsInParentheses(device.label);

                option.label = textLabel[0];

                deviceList.appendChild(option);
            });
        });
    });  

    // Listen for changes to the device list selection & send the selected device ID to the content script to change output.
    deviceList.addEventListener('change', function(){
        id = String(this.value);
        console.log(id);

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'setOutputDevice', deviceId: id}, function(response) {});
        });  
        
    });

    let volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.addEventListener('input', function (){
        // Update the % label
        let volumeLabel = document.getElementById('volumePercentage');
        volumeLabel.innerHTML = volumeSlider.value + "%";

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'setVolume', volume: volumeSlider.value}, function(response) {});
        });  
    });

});

function getTextGroupsInParentheses(str) {
    let results = [];
    let currentCount = 0;
    let start = 0;
    let end = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            if (currentCount == 0) start = i;
            currentCount++;
        } else if (str[i] === ')') {
            currentCount--;
            end = i;
            if (currentCount == 0) {
                results.push(str.substring(start + 1, end));
            }
        }
    }
    return results;

}
  
