// Listen for messages from the popup or background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Handle the "setOutputDevice" message.
    if (request.action == 'setOutputDevice') {
        SetOutputDevice(request, sender, sendResponse);
    } else if(request.action == "getDeviceList") {
        // Get the audio device list .
        GetDeviceList(request, sender, sendResponse);
        return true;
    }

  });

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
            sink.setSinkId(deviceId);
            console.log()
        } catch (e) {
            // console.log("Error setting sink: ", e);
        }
    })

}