// Get the device list from the background page.
document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getDeviceList' }, function(response) {
            // Get a reference to the device list dropdown.
            var deviceList = document.getElementById('deviceList');
        
                console.log("HELLO?");
                console.log(response);

            // Populate the device list dropdown with the available devices.
            response.forEach(function(device) {
                var option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label;
                deviceList.appendChild(option);
            });
        });
    });  

    // Listen for changes to the device list selection & send the selected device ID to the content script to change output.
    deviceList.addEventListener('change', function() {
        console.log(typeof this.value);
        id = String(this.value);

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'setOutputDevice', deviceId: id}, function(response) {});
        });  
        
    });
});

