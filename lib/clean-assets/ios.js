const fs = require('fs-extra');
const path = require('path');
const xcode = require('xcode');
const createGroupWithMessage = require('../react-native-lib/ios/createGroupWithMessage');
const getPlist = require('../react-native-lib/ios/getPlist');
const writePlist = require('../react-native-lib/ios/writePlist');
const getTargetUUID = require('../react-native-lib/ios/getTargetUUID');
const log = require('npmlog');


/**
 * This function works in a similar manner to its Android version,
 * except it does not delete assets but removes Xcode Group references
 */
module.exports = function cleanAssetsIOS(files, projectConfig, { addFont }, targets) {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();

  (targets || [undefined]).forEach(target => {

    target && log.info("Target: " + target)
    const plist = getPlist(project, projectConfig.sourceDir, target);

    createGroupWithMessage(project, 'Resources');

    function removeResourceFile(f) {
      return (f || [])
        .map(asset => (
          project.removeResourceFile(
            path.relative(projectConfig.sourceDir, asset),
            { target: getTargetUUID(project, target) },
          )
        ))
        .filter(file => file) // xcode returns false if file is already there
        .map(file => file.basename);
    }

    const removedFiles = removeResourceFile(files);

    if (addFont) {
      const existingFonts = (plist.UIAppFonts || []);
      const allFonts = existingFonts.filter(file => removedFiles.indexOf(file) === -1);
      plist.UIAppFonts = Array.from(new Set(allFonts)); // use Set to dedupe w/existing
    }

    fs.writeFileSync(
      projectConfig.pbxprojPath,
      project.writeSync(),
    );

    writePlist(project, projectConfig.sourceDir, plist, target);

  })
};
