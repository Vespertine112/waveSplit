// Listen for messages from the popup or background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Handle the "setOutputDevice" message.
    if (request.action == 'setOutputDevice') {
        SetOutputDevice(request, sender, sendResponse);
        return true;
    } else if(request.action == "getDeviceList") {
        // Get the audio device list .
        GetDeviceList(request, sender, sendResponse);
        return true;
    }
  });

let cachedDeviceID = "";
let validSinks = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'setVolume') {
        SetVolume(request, sender, sendResponse);
    }
    return true;
});

function SetVolume(request, sender, sendResponse){
    let volume = request.volume / 100;
    
    let sinks = document.querySelectorAll('*');
    sinks.forEach(sink => {
        sink.volume = volume;
    });

    sendResponse({});
}

function GetDeviceList(request, sender, sendResponse){
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    navigator.mediaDevices.enumerateDevices().then( devices => {
        audioDevices = devices.filter( device => device.kind === 'audiooutput');
        
        // Send to the background page.
        sendResponse(audioDevices);
    });
}

function SetOutputDevice(request, sender, sendResponse){
    // Get the selected device ID from the message.
    var deviceId = request.deviceId;

    // Brute force method to setting all *Literally all* node sinks to the selected device. 
    let sinks = document.querySelectorAll('*');
    sinks.forEach(sink => {
        try{
            sink.setSinkId(deviceId)
            cachedDeviceID = deviceId;
            validSinks.push(sink);
        } catch (e) {
            // console.log("Error setting sink: ", e);
        }
    });

    sendResponse({});
}