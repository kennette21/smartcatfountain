var tapo = require("tp-link-tapo-connect");
var express = require("express");
var app = express();
const path = require("path");
require("dotenv").config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

app.use(express.static("public"));

app.get("/", async function (req, res) {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/status", async function (req, res) {
	console.log("/status called: ");
	const { info, token } = await getFountainInfo();
	res.send(info.device_on);
});

// accepts on or off as query parameters to force a particular state
app.get("/toggle", async function (req, res) {
	console.log("/toggle called: ", req.query);
	const { info, token } = await getFountainInfo();
	if (Object.keys(req.query).includes("on")) {
		setSmartSwitch(token, true);
		return;
	}

	if (Object.keys(req.query).includes("off")) {
		setSmartSwitch(token, false);
		return;
	}

	setSmartSwitch(token, !info.device_on);
});

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
});

const getFountainInfo = async () => {
	// Authorize then list device
	try {
		const cloudToken = await tapo.cloudLogin(email, password);
		const devices = await tapo.listDevicesByType(
			cloudToken,
			"SMART.TAPOPLUG"
		);

		// get device token and determine current state
		const deviceToken = await tapo.loginDevice(email, password, devices[0]); // todo: always grabbing the first device
		const getDeviceInfoResponse = await tapo.getDeviceInfo(deviceToken);

		return { info: getDeviceInfoResponse, token: deviceToken };
	} catch (error) {
		console.error("failed fetching fountain info with error: ", error);
		return { info: "", token: "" };
	}
};

const setSmartSwitch = async (deviceToken, targetState) => {
	if (targetState) {
		console.log("turning fountain ON");
		try {
			tapo.turnOn(deviceToken);
		} catch (error) {
			console.error("failed turning ON switch with error: ", error);
		}
	} else {
		console.log("turning fountain OFF");
		try {
			tapo.turnOff(deviceToken);
		} catch (error) {
			console.error("failed turning OFF switch with error: ", error);
		}
	}
};
