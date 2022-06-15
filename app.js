var tapo = require("tp-link-tapo-connect");
var express = require("express");
var app = express();
const path = require("path");

const email = "kennette21@gmail.com";
const password = "vidpYk-zycce5-ritpex"; // todo: secretify this password

app.use(express.static("public"));

app.get("/", async function (req, res) {
	res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/status", async function (req, res) {
	const { info, token } = await getPlugInfo();
	res.send(info.device_on);
});

app.get("/toggle", async function (req, res) {
	const { info, token } = await getPlugInfo();
	const isOn = info.device_on;
	toggleSmartSwitch(token, isOn);
});

app.get("/toggleOn", async function (req, res) {
	const { info, token } = await getPlugInfo();
	tapo.turnOn(token);
});

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
});

const getPlugInfo = async () => {
	// Authorize then list device
	const cloudToken = await tapo.cloudLogin(email, password);
	const devices = await tapo.listDevicesByType(cloudToken, "SMART.TAPOPLUG");
	console.log(devices[0]);

	// get device token and determine current state
	const deviceToken = await tapo.loginDevice(email, password, devices[0]); // Performs a mac lookup to determine local IP address
	// // const deviceToken = await loginDeviceByIp(email, password, deviceIp); // If you know your local device IP address
	console.log(deviceToken);
	const getDeviceInfoResponse = await tapo.getDeviceInfo(deviceToken);
	return { info: getDeviceInfoResponse, token: deviceToken };
};

const toggleSmartSwitch = async (deviceToken, isOn) => {
	if (isOn) {
		tapo.turnOff(deviceToken);
	} else {
		tapo.turnOn(deviceToken);
	}
};
