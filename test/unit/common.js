'use strict';

const q = require('q');
const sinon = require('sinon');
const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');
const git = require('simple-git');
const mkdirp = require('mkdirp');

const Master = require('../../lib/master');
const tools = require('../../lib/tools');
const config = require('./lib/config.testdata');

module.exports = {
  q,
  rootDir: path.resolve(__dirname, '..', '..'),
  sinon,
  assert,
  fs,
  path,
  jsonfile,
  Master,
  config,
  tools,
  git,
  mkdirp,
  master: new Master(config),
};
