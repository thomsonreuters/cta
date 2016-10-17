'use strict';

const childProcess = require('child_process');
const exec = childProcess.exec;

module.exports = function install(folder) {
  return new Promise((resolve, reject) => {
    process.chdir(folder);
    const child = exec('npm install');
    child.stdout.on('data', function(log) {

    });
    child.stderr.on('data', function(log) {

    });
    child.on('close', function() {
      resolve();
    });
  });
};
