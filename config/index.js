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

config.repositories = custom.repositories || {
  "cta-restapi": "git@git.sami.int.thomsonreuters.com:compass/cta-restapi.git",
  "cta-app-agent": "git@git.sami.int.thomsonreuters.com:compass/cta-app-agent.git",
  "cta-app-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-app-boilerplate.git",
  "cta-app-executiondataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-executiondataservice.git",
  "cta-app-instancedataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-instancedataservice.git",
  "cta-app-jobmanagerservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-jobmanagerservice.git",
  "cta-app-scenariodataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-scenariodataservice.git",
  "cta-app-schedulerdataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-schedulerdataservice.git",
  "cta-brick": "git@git.sami.int.thomsonreuters.com:compass/cta-brick.git",
  "cta-brick-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-brick-boilerplate.git",
  "cta-brick-request": "git@git.sami.int.thomsonreuters.com:compass/cta-brick-request.git",
  "cta-common": "git@git.sami.int.thomsonreuters.com:compass/cta-common.git",
  "cta-dblayer": "git@git.sami.int.thomsonreuters.com:compass/cta-dblayer.git",
  "cta-expresswrapper": "git@git.sami.int.thomsonreuters.com:compass/cta-expresswrapper.git",
  "cta-flowcontrol": "git@git.sami.int.thomsonreuters.com:compass/cta-flowcontrol.git",
  "cta-io": "git@git.sami.int.thomsonreuters.com:compass/cta-io.git",
  "cta-logger": "git@git.sami.int.thomsonreuters.com:compass/cta-logger.git",
  "cta-messaging": "git@git.sami.int.thomsonreuters.com:compass/cta-messaging.git",
  "cta-security": "git@git.sami.int.thomsonreuters.com:compass/cta-security.git",
  "cta-silo": "git@git.sami.int.thomsonreuters.com:compass/cta-silo.git",
  "cta-tool": "git@git.sami.int.thomsonreuters.com:compass/cta-tool.git",
  "cta-tool-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-tool-boilerplate.git",
  "cta-tool-request": "git@git.sami.int.thomsonreuters.com:compass/cta-tool-request.git",
  "cta-app-healthcheckdataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-healthcheckdataservice.git",
  "cta-app-notificationservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-notificationservice.git"
};

module.exports = config;
