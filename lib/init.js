'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function init(dir) {
  return new Promise((resolve, reject) => {
    const output = [];
    try {
      output.push({
        level: 'title',
        content: 'Init Source Directory...',
      }, {
        level: 'info',
        content: `Source Directory is: ${dir}`,
      });
      fs.access(dir, (err) => {
        if (!err) {
          output.push({
            level: 'info',
            content: 'Source Directory already exists',
          });
        } else {
          mkdirp.sync(dir);
          output.push({
            level: 'info',
            content: 'Created Source Directory',
          });
        }
        output.push({
          level: 'top',
          content: `Working Source Directory: ${dir}`,
        });
        resolve(output);
      });
    } catch (err) {
      output.push({
        level: 'info',
        content: `Can't create source directory ${dir}`,
      });
      output.push({
        level: 'info',
        content: err,
      });
      reject(output);
    }
  });
};
