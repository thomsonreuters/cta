'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

const Master = require('../../lib/master');
const tools = require('../../lib/tools');
const config = require('./lib/config.testdata');

module.exports = {
  sinon: sinon,
  assert: assert,
  fs: fs,
  path: path,
  Master: Master,
  master: new Master(config),
  config: config,
  tools: tools,
};
