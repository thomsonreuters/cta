'use strict';

const argv = require('yargs').argv;
const config = require('../config');
const MasterLib = require('./master');
const master = new MasterLib(config);
const commands = [];
if (argv.c) {
  commands.push('clone');
}
if (argv.p) {
  commands.push('pull');
}
if (argv.i) {
  commands.push('install');
}
master.all(commands);