chrome.action.onClicked.addListener(async (tab) => {
    // Check if a tab is active
    if (!tab.id) return;

    // Inject script into the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // Function to trigger PiP for video
            function activatePiP(video) {
                if (video) {
                    video.requestPictureInPicture().catch(err => console.log("Error: " + err));
                } else {
                    alert("No video element found on this page.");
                }
            }

            // Look for videos in the main document
            let videos = document.getElementsByTagName("video");
            if (videos.length > 0) {
                activatePiP(videos[0]);
                return;
            }

            // Look for videos inside iframes
            const iframes = document.getElementsByTagName('iframe');
            for (let i = 0; i < iframes.length; i++) {
                try {
                    let iframeVideos = iframes[i].contentWindow.document.getElementsByTagName("video");
                    if (iframeVideos.length > 0) {
                        activatePiP(iframeVideos[0]);
                        return;
                    }
                } catch (error) {
                    console.log("Unable to access iframe video due to cross-origin issues.");
                }
            }

            alert("No video found in the main document or iframes.");
        }
    });
});
