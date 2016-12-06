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
    try {
      fs.accessSync(dir);
      return true;
    } catch (e) {
      return false;
    }
  }

  isDir(dir) {
    try {
      const stat = fs.statSync(dir);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  }

  isFile(file) {
    try {
      const stat = fs.statSync(file);
      return stat.isFile();
    } catch (e) {
      return false;
    }
  }
}

module.exports = new Common();
