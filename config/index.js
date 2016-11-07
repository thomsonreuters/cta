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
  "cta-afterhandler": "git@git.sami.int.thomsonreuters.com:compass/cta-afterhandler.git",
  "cta-agentrestapi": "git@git.sami.int.thomsonreuters.com:compass/cta-agentrestapi.git",
  "cta-app-agent": "git@git.sami.int.thomsonreuters.com:compass/cta-app-agent.git",
  "cta-app-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-app-boilerplate.git",
  "cta-app-executiondataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-executiondataservice.git",
  "cta-app-instancedataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-instancedataservice.git",
  "cta-app-scenariodataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-scenariodataservice.git",
  "cta-app-schedulerdataservice": "git@git.sami.int.thomsonreuters.com:compass/cta-app-schedulerdataservice.git",
  "cta-brick": "git@git.sami.int.thomsonreuters.com:compass/cta-brick.git",
  "cta-brick-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-brick-boilerplate.git",
  "cta-brick-request": "git@git.sami.int.thomsonreuters.com:compass/cta-brick-request.git",
  "cta-common": "git@git.sami.int.thomsonreuters.com:compass/cta-common.git",
  "cta-dblayer": "git@git.sami.int.thomsonreuters.com:compass/cta-dblayer.git",
  "cta-expresswrapper": "git@git.sami.int.thomsonreuters.com:compass/cta-expresswrapper.git",
  "cta-flowcontrol": "git@git.sami.int.thomsonreuters.com:compass/cta-flowcontrol.git",
  "cta-flowcontrol-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-flowcontrol-boilerplate.git",
  "cta-flowcontrol-sample": "git@git.sami.int.thomsonreuters.com:compass/cta-flowcontrol-sample.git",
  "cta-healthcheck": "git@git.sami.int.thomsonreuters.com:compass/cta-healthcheck.git",
  "cta-inboundadapter": "git@git.sami.int.thomsonreuters.com:compass/cta-inboundadapter.git",
  "cta-instance": "git@git.sami.int.thomsonreuters.com:compass/cta-instance.git",
  "cta-io": "git@git.sami.int.thomsonreuters.com:compass/cta-io.git",
  "cta-jobbroker": "git@git.sami.int.thomsonreuters.com:compass/cta-jobbroker.git",
  "cta-jobhandler": "git@git.sami.int.thomsonreuters.com:compass/cta-jobhandler.git",
  "cta-jobmanager": "git@git.sami.int.thomsonreuters.com:compass/cta-jobmanager.git",
  "cta-logger": "git@git.sami.int.thomsonreuters.com:compass/cta-logger.git",
  "cta-messaging": "git@git.sami.int.thomsonreuters.com:compass/cta-messaging.git",
  "cta-outboundadapter": "git@git.sami.int.thomsonreuters.com:compass/cta-outboundadapter.git",
  "cta-reporter": "git@git.sami.int.thomsonreuters.com:compass/cta-reporter.git",
  "cta-repository": "git@git.sami.int.thomsonreuters.com:compass/cta-repository.git",
  "cta-restapi": "git@git.sami.int.thomsonreuters.com:compass/cta-restapi.git",
  "cta-resultcollector": "git@git.sami.int.thomsonreuters.com:compass/cta-resultcollector.git",
  "cta-scenario-service": "git@git.sami.int.thomsonreuters.com:compass/cta-scenario-service.git",
  "cta-scheduler": "git@git.sami.int.thomsonreuters.com:compass/cta-scheduler.git",
  "cta-security": "git@git.sami.int.thomsonreuters.com:compass/cta-security.git",
  "cta-silo": "git@git.sami.int.thomsonreuters.com:compass/cta-silo.git",
  "cta-tool": "git@git.sami.int.thomsonreuters.com:compass/cta-tool.git",
  "cta-tool-boilerplate": "git@git.sami.int.thomsonreuters.com:compass/cta-tool-boilerplate.git",
  "cta-tool-request": "git@git.sami.int.thomsonreuters.com:compass/cta-tool-request.git",
};

module.exports = config;
