const getTargetUUID = require('./getTargetUUID');

module.exports = function getProjectTarget(project, targetName) {

  if (typeof targetName === "undefined") {
    return project.getFirstTarget().firstTarget;
  }

  const targetUUID = getTargetUUID(project, targetName);

  return project.pbxNativeTargetSection()[targetUUID];
}