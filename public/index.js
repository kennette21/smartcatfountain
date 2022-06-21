console.log("running index.js in the client");

const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const enableWebcamButton = document.getElementById("webcamButton");

// Check if webcam access is supported.
function getUserMediaSupported() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will
// define in the next step.
if (getUserMediaSupported()) {
	enableWebcamButton.addEventListener("click", enableCam);
} else {
	console.warn("getUserMedia() is not supported by your browser");
}

// Placeholder function for next step. Paste over this in the next step.
function enableCam(event) {
	// Only continue if the COCO-SSD has finished loading.
	if (!model) {
		return;
	}

	// Hide the button once clicked.
	event.target.classList.add("removed");

	// getUsermedia parameters to force video but not audio.
	const constraints = {
		video: true,
	};

	// Activate the webcam stream.
	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
		video.srcObject = stream;
		video.addEventListener("loadeddata", predictWebcam);
	});
}

// Pretend model has loaded so we can try out the webcam code.
var model = undefined;

cocoSsd.load().then(function (loadedModel) {
	model = loadedModel;
	// Show demo section now model is ready to use.
	// demosSection.classList.remove("invisible");
	document.getElementById("webcamButton").removeAttribute("disabled");

	// enable the webcam here
});

var catFoundRecently = false;
var personFoundRecently = false;

function predictWebcam() {
	// Now let's start classifying a frame in the stream.
	model.detect(video).then(function (predictions) {
		// todo: add back video feed and feed highlights

		for (let n = 0; n < predictions.length; n++) {
			if (predictions[n].score > 0.6) {
				switch (predictions[n].class) {
					case "person":
						if (!personFoundRecently) {
							personFoundRecently = true;
							console.log("seeing a person");
							setTimeout(() => {
								personFoundRecently = false;
							}, 3000);
						}
						break;
					case "cat":
						if (!catFoundRecently) {
							catFoundRecently = true;
							console.log("seeing a cat");
							fetch("/toggle?on");
							setTimeout(() => {
								catFoundRecently = false;
								fetch("/toggle?off");
							}, 1000 * 15);
						}
						break;
					default:
						console.log(
							"seeing something unkown: ",
							predictions[n].class
						);
				}
			}
		}

		// Call this function again to keep predicting when the browser is ready.
		window.requestAnimationFrame(predictWebcam);
	});
}
