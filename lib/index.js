'use strict';

const argv = require('yargs').argv;
const config = require('../config');
const MasterLib = require('./master');
const master = new MasterLib(config);
master.start(argv);
