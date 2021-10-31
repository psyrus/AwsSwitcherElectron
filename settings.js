const fs = require('fs');
const Constants = require('./src/constants');

const settingsFilePath = Constants.SETTINGS_FILE_LOCATION
let settings = {};

function loadSettings() {
    try {
        fs.readFileSync(settingsFilePath)
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Create file if it does not yet exist
            saveSettings();
        } else {
            throw error;
        }
    }
    settings = JSON.parse(fs.readFileSync(settingsFilePath));

    for (let attributeName in settings) {
        if (attributeName == "VpnSettingsFilePath") {
            document.getElementById("current" + attributeName).innerText = settings[attributeName];
            continue;
        }
        if (attributeName == "SquadLauncherFilePath") {
            document.getElementById("current" + attributeName).innerText = settings[attributeName];
            continue;
        }
        document.getElementById(attributeName).value = settings[attributeName];
    }
}

function saveSettings() {
    console.log("Save settings!");
    settings.AccessKeyId = document.getElementById("AccessKeyId").value;
    settings.SecretAccessKey = document.getElementById("SecretAccessKey").value;
    settings.InstanceId = document.getElementById("InstanceId").value;
    settings.Region = document.getElementById("Region").value;
    settings.VpnSettingsFilePath = document.getElementById("VpnSettingsFilePath").files[0]?.path ?? settings.VpnSettingsFilePath ?? "";
    settings.SquadLauncherFilePath = document.getElementById("SquadLauncherFilePath").files[0]?.path ?? settings.SquadLauncherFilePath ?? "";
    console.log(settings)

    let data = JSON.stringify(settings, null, 2);
    fs.writeFileSync(settingsFilePath, data);
}

loadSettings();

const saveBtn = document.getElementById("submitSettingsBtn");
saveBtn.addEventListener("click", function () {
    console.log("save button clicked");
    saveSettings();
    loadSettings();
});
