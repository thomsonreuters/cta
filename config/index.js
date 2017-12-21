/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const config = {};
let custom = {};

try {
  if (fs.statSync(__dirname + path.sep + 'config.js').isFile()) {
    custom = require('./config.js');
    console.log('Loading custom configuration');
  }
} catch (e) {
  console.log('Using default configuration');
}

/* *****************************************************************************************
 *                                                                                         *
 * Working root directory                                                                  *
 *                                                                                         *
 ******************************************************************************************/

config.root = custom.root || path.resolve(__dirname, '..');

/* *****************************************************************************************
 *                                                                                         *
 * Sources directory where all CTA projects will be cloned to                              *
 * It should end with node_modules                                                         *
 * See why in readme file                                                                  *
 *                                                                                         *
 ******************************************************************************************/

config.sources = custom.sources || path.resolve(config.root, 'src', 'node_modules');

/* *****************************************************************************************
 *                                                                                         *
 * Packages directory where all CTA projects vendor dependencies will be installed on      *
 * It should end with node_modules and located in a parent folder of "sources" directory   *
 * See why in readme file                                                                  *
 *                                                                                         *
 ******************************************************************************************/

config.packages = custom.packages || path.resolve(config.root, 'node_modules');

/* *****************************************************************************************
 *                                                                                         *
 * The full path to a log file where to save logs                                          *
 *                                                                                         *
 ******************************************************************************************/

config.log = custom.log || path.resolve(config.root, 'logs', 'output.log');


/* *****************************************************************************************
 *                                                                                         *
 * Prefix of CTA repositories folders names, used to check if a folder is a CTA repo       *
 *                                                                                         *
 ******************************************************************************************/

config.prefix = custom.prefix || 'cta-';

/* *****************************************************************************************
 *                                                                                         *
 * CTA known repositories that will be cloned/updated each time your run the tool          *
 *                                                                                         *
 ******************************************************************************************/
/*
  "cta-app-agent": "git@github.com:thomsonreuters/cta-app-agent.git",
  "cta-app-boilerplate": "git@github.com:thomsonreuters/cta-app-boilerplate.git",
  "cta-app-executiondataservice": "git@github.com:thomsonreuters/cta-app-executiondataservice.git",
  "cta-app-healthcheckdataservice": "git@github.com:thomsonreuters/cta-app-healthcheckdataservice.git",
  "cta-app-instancedataservice": "git@github.com:thomsonreuters/cta-app-instancedataservice.git",
  "cta-app-jobmanagerservice": "git@github.com:thomsonreuters/cta-app-jobmanagerservice.git",
  "cta-app-notificationservice": "git@github.com:thomsonreuters/cta-app-notificationservice.git",
  "cta-app-scenariodataservice": "git@github.com:thomsonreuters/cta-app-scenariodataservice.git",
  "cta-app-schedulerdataservice": "git@github.com:thomsonreuters/cta-app-schedulerdataservice.git",
  "cta-brick": "git@github.com:thomsonreuters/cta-brick.git",
  "cta-brick-boilerplate": "git@github.com:thomsonreuters/cta-brick-boilerplate.git",
  "cta-brick-request": "git@github.com:thomsonreuters/cta-brick-request.git",
  "cta-common": "git@github.com:thomsonreuters/cta-common.git",
  "cta-dblayer": "git@github.com:thomsonreuters/cta-dblayer.git",
  "cta-expresswrapper": "git@github.com:thomsonreuters/cta-expresswrapper.git",
  "cta-flowcontrol": "git@github.com:thomsonreuters/cta-flowcontrol.git",
  "cta-healthcheck": "git@github.com:thomsonreuters/cta-healthcheck.git",
  "cta-io": "git@github.com:thomsonreuters/cta-io.git",
  "cta-logger": "git@github.com:thomsonreuters/cta-logger.git",
  "cta-messaging": "git@github.com:thomsonreuters/cta-messaging.git",
  "cta-restapi": "git@github.com:thomsonreuters/cta-restapi.git",
  "cta-security": "git@github.com:thomsonreuters/cta-security.git",
  "cta-silo": "git@github.com:thomsonreuters/cta-silo.git",
  "cta-tool": "git@github.com:thomsonreuters/cta-tool.git",
  "cta-tool-boilerplate": "git@github.com:thomsonreuters/cta-tool-boilerplate.git",
  "cta-tool-request": "git@github.com:thomsonreuters/cta-tool-request.git"
 */


config.repositories = custom.repositories || {
    "cta-app-agent": "https://github.com/thomsonreuters/cta-app-agent",
    "cta-brick": "https://github.com/thomsonreuters/cta-brick",
    "cta-common": "https://github.com/thomsonreuters/cta-common",
    "cta-expresswrapper": "https://github.com/thomsonreuters/cta-expresswrapper",
    "cta-flowcontrol": "https://github.com/thomsonreuters/cta-flowcontrol",
    "cta-healthcheck": "https://github.com/thomsonreuters/cta-healthcheck",
    "cta-io": "https://github.com/thomsonreuters/cta-io",
    "cta-logger": "https://github.com/thomsonreuters/cta-logger",
    "cta-messaging": "https://github.com/thomsonreuters/cta-messaging",
    "cta-restapi": "https://github.com/thomsonreuters/cta-restapi",
    "cta-silo": "https://github.com/thomsonreuters/cta-silo",
    "cta-tool": "https://github.com/thomsonreuters/cta-tool"
  };

module.exports = config;
