'use strict';

const git = require('simple-git');

module.exports = function clone(repository, destination) {
  return new Promise((resolve, reject) => {
    let arr = repository.split('/');
    arr = arr[arr.length-1].split('.');
    const name = arr[0];
    git(destination)
      .clone(repository, name, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
