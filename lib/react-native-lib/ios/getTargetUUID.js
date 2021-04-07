module.exports = function getTargetUUID(project, targetName) {

  if (typeof targetName === "undefined") {
    return project.getFirstTarget().firstTarget.uuid;
  }

  const targets = project.getFirstProject()['firstProject']['targets'];
  const target = targets.find(target => target.comment === targetName);

  if (typeof target === "undefined") {
    console.log("Cannot find the target: " + targetName);
    process.exit()
  }
  return target.value;
};

