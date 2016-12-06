'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

const Master = require('../../lib/master');
const tools = require('../../lib/tools');
const config = require('./lib/config.testdata');

module.exports = {
  sinon,
  assert,
  fs,
  path,
  jsonfile,
  Master,
  config,
  tools,
  master: new Master(config),
};
