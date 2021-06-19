console.log("from index.js");

const electron = require("electron");
const ipc = electron.ipcRenderer;

/* AWS Setup Section */
const { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } = require("@aws-sdk/client-ec2"); // CommonJS
// Set the AWS Region.
const REGION = "ap-southeast-2"; //e.g. "us-east-1"
// Create anAmazon EC2 service client object.
const ec2Client = new EC2Client({ region: REGION });
const dic = new DescribeInstancesCommand({});
const myInstanceId = "i-09fb8f217e449cf50";
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
        updateInstanceData();
        if (totalSlept >= timeout) {
            console.error("Instance did not come up within the allotted time")
            throw "Big error bad man"
        }
    }
}

async function startInstance() {
    // Timeout is 5 minutes
    let timeout = 5 * 60 * 1000;
    // Send the API call
    // Every 5 seconds check on the state, update the table
    // If it gets to the desired state, end function
    // If it does not reach the state within 5 minutes, send an instance stop command, and display an error
    console.log("This has started working on the startInstance function")
    // Turn on instance if it isn't already on
    try {
        let x = await ec2Client.send(new StartInstancesCommand({
            InstanceIds: [instance.InstanceId]
        }));
    } catch (error) {
        console.log(error);
    }

    await pollForStatus(stateEnum.Running, timeout);
    // Get status again - Until it is "running"
}

async function stopInstance() {
    let timeout = 5 * 60 * 1000;

    console.log("This has started working on the stopInstance function")
    // Then turn it off
    try {
        let x = await ec2Client.send(new StopInstancesCommand({
            InstanceIds: [instance.InstanceId]
        }));
    } catch (error) {
        console.log(error);
    }

    await pollForStatus(stateEnum.Stopped, timeout);

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

    if (instance.State.Name == stateEnum.Stopped) {
        startInstance();
    } else {
        stopInstance();
    }
    console.log("State button clicked");
});

updateInstanceData();