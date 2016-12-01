'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = {
  isCtaDir(name) {
    return typeof name === 'string' && name.indexOf(config.prefix) === 0;
  },

  explore(base) {
    const that = this;
    return fs.readdirSync(base)
      .filter((dir) => {
        fs.statSync(path.join(base, dir)).isDirectory() && that.isCtaDir(dir);
      });
  },

  exists(dir) {
    return new Promise((resolve, reject) => {
      try {
        fs.access(dir, (err) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  },

  isDir(dir) {
    let isDir = false;
    try {
      const stat = fs.statSync(dir);
      isDir = stat.isDirectory();
    } catch (e) {
      // console.log('common.isDir: ', e);
    }
    return isDir;
  },

  isFile(file) {
    let isFile = false;
    try {
      const stat = fs.statSync(file);
      isFile = stat.isFile();
    } catch (e) {
      // console.log('common.isFile: ', e);
    }
    return isFile;
  },
};
