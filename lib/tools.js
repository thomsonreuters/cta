/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const fs = require('fs-extra');
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
