'use strict';

const git = require('simple-git');

module.exports = function pull(folder) {
  return new Promise((resolve, reject) => {
    git(folder)
      .pull((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
