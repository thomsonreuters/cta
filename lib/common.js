'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');

class Common {

  isCtaDir(name) {
    return typeof name === 'string' && name.indexOf(config.prefix) === 0;
  }

  explore(base) {
    const that = this;
    const dirs = fs.readdirSync(base);
    return dirs.filter((dir) => {
      const isDirectory = fs.statSync(path.join(base, dir)).isDirectory();
      const isCtaDir = that.isCtaDir(dir);
      return isDirectory && isCtaDir;
    });
  }

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
  }

  isDir(dir) {
    let isDir = false;
    try {
      const stat = fs.statSync(dir);
      isDir = stat.isDirectory();
    } catch (e) {
      // console.log('common.isDir: ', e);
    }
    return isDir;
  }

  isFile(file) {
    let isFile = false;
    try {
      const stat = fs.statSync(file);
      isFile = stat.isFile();
    } catch (e) {
      // console.log('common.isFile: ', e);
    }
    return isFile;
  }
}

module.exports = new Common();
