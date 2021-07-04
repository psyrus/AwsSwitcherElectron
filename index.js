console.log("from index.js");
<<<<<<< HEAD
const spawn = require('child_process').spawn;
const electron = require("electron");
const ipc = electron.ipcRenderer;
const fs = require('fs');
const Constants = require('./src/constants');

console.log("Constants file: " + Constants.SETTINGS_FILE_LOCATION);
=======

const electron = require("electron");
const ipc = electron.ipcRenderer;
>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f

/* AWS Setup Section */
const { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } = require("@aws-sdk/client-ec2"); // CommonJS
// Set the AWS Region.
// Create anAmazon EC2 service client object.
const settingsFilePath = Constants.SETTINGS_FILE_LOCATION
const settings = JSON.parse(fs.readFileSync(settingsFilePath));
process.env.AWS_ACCESS_KEY_ID = settings.AccessKeyId
process.env.AWS_SECRET_ACCESS_KEY = settings.SecretAccessKey
const REGION = settings.Region; //e.g. "us-east-1"

const ec2Client = new EC2Client({ region: REGION });
const dic = new DescribeInstancesCommand({});
const myInstanceId = settings.InstanceId;
const stateEnum = {
    Running: "running",
    Stopped: "stopped"
};

const delay = ms => new Promise(res => setTimeout(res, ms));

let instance = null;
/* End AWS Setup Section */

const settingsBtn = document.getElementById("settingsBtn");
const toggleStateBtn = document.getElementById("toggleStateBtn");

function formatWithLeadingZero(inputValue) {
    return ('0' + inputValue).slice(-2)
}
async function updateInstanceData() {
    let instanceData = await getInstanceState(myInstanceId);
    document.getElementById("instanceName").innerText = instanceData.InstanceId;
    document.getElementById("instanceState").innerText = instanceData.State.Name;
    document.getElementById("instanceIp").innerText = instanceData.State.Name == "running" ? instanceData.PublicIpAddress : "N/A";
    let dt = new Date(instanceData.LaunchTime);
    const formatted = `${dt.getFullYear()}-${formatWithLeadingZero(dt.getMonth() + 1)}-${formatWithLeadingZero(dt.getDate())} ${formatWithLeadingZero(dt.getHours())}:${formatWithLeadingZero(dt.getMinutes())}`
    document.getElementById("instanceLastChanged").innerText = formatted;
    updateInstanceToggleButton(instanceData.State.Name);
    instance = instanceData;
}

function updateInstanceToggleButton(state) {
    let valueMapping = {
        "running": "Stop Instance",
        "stopped": "Start Instance",
    };
    let unknownStateMessage = `State unhandled: ${state}`
    let msg = ""
    if (state in valueMapping) {
        msg = valueMapping[state];
        toggleStateBtn.disabled = false;
    } else {
        msg = unknownStateMessage;
        toggleStateBtn.disabled = true;
    }
    toggleStateBtn.innerText = msg;
}

async function getInstanceState(instanceId) {
    try {
        const instanceState = await ec2Client.send(new DescribeInstancesCommand({
            InstanceIds: [myInstanceId]
        }));
        const desiredInstance = instanceState.Reservations?.reduce((returnCollection, resv, i) => {
            return returnCollection.concat(resv.Instances);
        }, []);
        return desiredInstance[0];
    } catch (error) {
        console.log("Error", error);
    }
}

async function pollForStatus(desiredState, timeout) {
    let sleepTime = 5000;
    let totalSlept = 0;
    while (instance.State.Name != desiredState) {
        console.log(`Instance has not reached a '${desiredState}' state yet... sleeping for several seconds`);
        await delay(sleepTime);
        totalSlept += sleepTime;
<<<<<<< HEAD
        await updateInstanceData();
=======
        updateInstanceData();
>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f
        if (totalSlept >= timeout) {
            console.error("Instance did not come up within the allotted time")
            throw "Big error bad man"
        }
    }
}

<<<<<<< HEAD
function connectVpn() {
    let exePath = "C:\\Program Files\\OpenVPN\\bin\\openvpn-gui.exe";
    let vpnFile = "client1.ovpn";

    var child = spawn(exePath, ['--connect', vpnFile]);
    // attach events, etc.
}

function disconnectVpn() {
    let exePath = "C:\\Program Files\\OpenVPN\\bin\\openvpn-gui.exe";
    let vpnFile = "client1.ovpn";

    var child = spawn(exePath, ['--command', 'disconnect_all']);
    // attach events, etc.
}

function updateVpnSettingsFile(ipAddress) {
    // Load the file
    let fs = require('fs');

    let p = settings.VpnSettingsFilePath;
    fs.readFile(p, 'utf8', function (err, data) {
        if (err) return console.log(err);

        let regex = /^remote ((?:\d*\.?)+) 1194/gm;
        let m = data.match(regex);
        let replaceValue = `remote ${ipAddress} 1194`;
        let replacedData = data.replace(m.toString(), replaceValue);
        fs.writeFileSync(p, replacedData, 'utf-8');
    });
}
=======
>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f
async function startInstance() {
    // Timeout is 5 minutes
    let timeout = 5 * 60 * 1000;
    // Send the API call
    // Every 5 seconds check on the state, update the table
    // If it gets to the desired state, end function
    // If it does not reach the state within 5 minutes, send an instance stop command, and display an error
    console.log("This has started working on the startInstance function")
<<<<<<< HEAD
    try {
        await ec2Client.send(new StartInstancesCommand({
=======
    // Turn on instance if it isn't already on
    try {
        let x = await ec2Client.send(new StartInstancesCommand({
>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f
            InstanceIds: [instance.InstanceId]
        }));
    } catch (error) {
        console.log(error);
    }

    await pollForStatus(stateEnum.Running, timeout);
<<<<<<< HEAD

    let instanceData = await getInstanceState(myInstanceId);
    updateVpnSettingsFile(instanceData.PublicIpAddress);
    if (document.getElementById("connectVpn").checked == true) {
        connectVpn();
    }

    // Log location: C:\Users\Trevor\OpenVPN\log\client1.log
    // Should just read that file until it determines that it is successfully connected
    if (document.getElementById("startSquad").checked == true) {
        startSquad();
    }
}

function startSquad() {
    let exePath = "G:\\Program Files (x86)\\Steam\\steamapps\\common\\Squad\\squad_launcher.exe";
    var child = spawn(exePath);
    // attach events, etc.
=======
    // Get status again - Until it is "running"
>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f
}

async function stopInstance() {
    let timeout = 5 * 60 * 1000;

    console.log("This has started working on the stopInstance function")
    // Then turn it off
<<<<<<< HEAD
    disconnectVpn();

=======
>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f
    try {
        let x = await ec2Client.send(new StopInstancesCommand({
            InstanceIds: [instance.InstanceId]
        }));
    } catch (error) {
        console.log(error);
    }

    await pollForStatus(stateEnum.Stopped, timeout);
<<<<<<< HEAD
=======

>>>>>>> 0c0a2033ef243418b50b18611921f419347c3a1f
}

// Should set up a timer function that refreshes the state of the thing every 5 seconds
// But if we do that it's super inefficient... It should be event based I reckon

settingsBtn.addEventListener("click", function () {
    console.log("Settings button clicked");
    ipc.send("openSettings");
});

toggleStateBtn.addEventListener("click", function () {
    console.log(instance.State.Name)
    console.log(stateEnum.Running)
    toggleStateBtn.disabled = true;
    if (instance.State.Name == stateEnum.Stopped) {
        startInstance();
    } else {
        stopInstance();
    }
    console.log("State button clicked");
});

updateInstanceData();
