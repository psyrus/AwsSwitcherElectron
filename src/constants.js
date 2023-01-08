
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { settings } = require('cluster');
const configFileName = "settings.json";
const userFileLocation = (electron.app || electron.remote.app).getPath('userData');
const settingsDefaults = {
    AccessKeyId: "",
    SecretAccessKey: "",
    Region: "",
    InstanceId: "",
    VpnSettingsFilePath: "",
    SquadLauncherFilePath: "",
};

module.exports = Object.freeze({
    SETTINGS_FILE_LOCATION: path.join(userFileLocation, configFileName),
    SETTINGS_DEFAULTS: settingsDefaults,
});
