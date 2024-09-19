chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return; // Ensure the tab is active

    // Inject script into the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // Function to toggle play/pause, PiP, volume, and mute/unmute
            function controlVideo(video) {
                if (video) {
                    // Toggle Play/Pause
                    if (video.paused) {
                        video.play();
                        console.log("Video is playing");
                    } else {
                        video.pause();
                        console.log("Video is paused");
                    }

                    // Request Picture-in-Picture mode
                    video.requestPictureInPicture().catch(err => console.log("Error: " + err));
                }

                // Look for videos in the main document
                let videos = document.getElementsByTagName("video");
                if (videos.length > 0) {
                    controlVideo(videos[0]);
                    return;
                }

                // Look for videos inside iframes
                const iframes = document.getElementsByTagName('iframe');
                for (let i = 0; i < iframes.length; i++) {
                    try {
                        let iframeVideos = iframes[i].contentWindow.document.getElementsByTagName("video");
                        if (iframeVideos.length > 0) {
                            controlVideo(iframeVideos[0]);
                            return;
                        }
                    } catch (error) {
                        console.log("Unable to access iframe video due to cross-origin issues.");
                    }
                }

                alert("No video found in the main document or iframes.");
            }
        }
    });
});
