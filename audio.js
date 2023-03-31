// Listen for messages from the popup or background page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Handle the "setOutputDevice" message.
    if (request.action == 'setOutputDevice') {
        SetOutputDevice(request, sender, sendResponse);
    } else if(request.action == "getDeviceList") {
        // Get the audio device list .
        navigator.mediaDevices.enumerateDevices().then( devices => {
            audioDevices = devices.filter( device => device.kind === 'audiooutput');

            // Send to the background page.
            sendResponse(audioDevices);
        });
        return true;
    }

  });

function SetOutputDevice(request, sender, sendResponse){
    // Get the selected device ID from the message.
    var deviceId = request.deviceId;

    // Brute force method to set the audio output device by finding all audio elements and setting the sink. CONVERT THIS TO CACHE!
    let sinks = document.querySelectorAll('[class*="video"]')
    sinks.forEach(sink => {
        try{
            sink.setSinkId(deviceId);
            console.log()
        } catch (e) {
            // console.log("Error setting sink: ", e);
        }
    })
    
    
    // var ctx = new AudioContext( {sinkId: deviceId});
    // // Set the audio output device to the selected device.
    // ctx.setSinkId(deviceId)
    // .then(res => {
    //     console.log('Audio output device set to: ' + deviceId, res);
    // })
    // .catch(err => {
    //     console.error('Error setting audio output device: ' + err);
    // });
}