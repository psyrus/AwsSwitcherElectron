
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const configFileName = "settings.json";
const userFileLocation = (electron.app || electron.remote.app).getPath('userData');

module.exports = Object.freeze({
    SETTINGS_FILE_LOCATION: path.join(userFileLocation, configFileName)
});
