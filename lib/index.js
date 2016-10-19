'use strict';

const argv = require('yargs').argv;
const config = require('../config');
const MasterLib = require('./master');
const master = new MasterLib(config);
if (argv.p) {
  master.pullAll();
} else {
  master.start();
}
