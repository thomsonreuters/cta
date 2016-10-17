'use strict';

const git = require('simple-git');

module.exports = function clone(repository, destination) {
  return new Promise((resolve, reject) => {
    git()
      .clone(repository, destination, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
