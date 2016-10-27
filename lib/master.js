'use strict';

const path = require('path');
const childProcess = require('child_process');
const exec = childProcess.exec;
const q = require('q');
const fs = require('fs');
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const winston = require('winston');
const _ = require('lodash');
const git = require('simple-git');
const co = require('co');

class Master {
  /**
   * Create a new Master instance
   * @param {object} conf - configuration object, see config folder
   */
  constructor (conf) {
    this.config = conf;
    this.logger = new winston.Logger({
      transports: [
        new (winston.transports.Console)({
          timestamp: true,
          colorize: true,
          level: 'silly',
        }),
        new (winston.transports.File)({
          timestamp: true,
          json: false,
          filename: conf.log,
          level: 'silly',
        }),
      ],
    });
    this.summary = {
      top: [],
      cloned: [],
      updated: [],
      errors: [],
    };
  }

  title(txt) {
    this.logger.info('');
    this.logger.info('# -------------------------------------------------------- #');
    this.logger.info(`# ${txt}`);
    this.logger.info('# -------------------------------------------------------- #');
    this.logger.info('');
  }

  exists(dir) {
    return new Promise((resolve, reject) => {
      try {
        fs.access(dir, (err) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Init working directory
   * @return {object} - promise
   */
  init () {
    const that = this;
    const deferred = q.defer();
    that.title('Init Base Directory...');
    that.logger.info(`Base Directory: ${that.config.sources}`);
    co(function * coroutine() {
      const sourcesExists = yield that.exists(that.config.sources);
      if (sourcesExists) {
        that.logger.info(`Base Directory already exists`);
      } else {
        mkdirp.sync(that.config.sources);
        that.logger.info(`Created Base Directory`);
      }
      const packagessExists = yield that.exists(that.config.packages);
      if (packagessExists) {
        that.logger.info(`Packages Directory already exists`);
      } else {
        mkdirp.sync(that.config.packages);
        that.logger.info(`Created Packages Directory`);
      }
      const globalEslint = that.config.sources + path.sep + '.eslintrc';
      const masterEslint = path.resolve(__dirname, '..') + path.sep + '.eslintrc';
      fs.createReadStream(masterEslint).pipe(fs.createWriteStream(globalEslint));
      that.logger.info(`Created/updated eslint in ${globalEslint}`);
      that.logger.info(`Working Base Directory is ${that.config.sources}`);
      that.summary.top.push(`Working Base Directory: ${that.config.sources}`);
      deferred.resolve();
    }).catch((e) => {
      deferred.reject(e);
      that.logger.info(`Can't create directory ${that.config.sources}`);
      that.logger.info(e);
      process.exit(0);
    });
    return deferred.promise;
  }

  /**
   * git clone project to working directory
   * @param {object} project - project name
   * @param {object} options - options
   * @param {retries} options.retries - current retry iteration in case it can't read from remote
   * @return {object} - promise
   * */
  clone(project, options) {
    const that = this;
    if (!options) {
      options = {
        retries: 0,
        deferred: q.defer(),
      };
    }
    if (options.retries === 0) {
      that.logger.log('info', `cloning ${project}... Please wait`);
    }
    git(that.config.sources)
      .clone(that.config.repositories[project], project, (err, data) => {
        if (err) {
          if (err.indexOf('already exists and is not an empty directory') !== 1) {
            that.logger.info(`${project} already cloned`);
            return options.deferred.resolve({cloned: false, error: err});
          } else if (options.retries < 2) {
            options.retries++;
            //that.logger.error(err);
            that.logger.error(`failed to clone ${project}, retrying ${options.retries} time...`);
            return that.clone(project, options);
          }
          that.logger.error(`failed to clone ${project}, aborting!`);
          that.summary.errors.push(`failed to clone ${project}`);
          options.deferred.resolve({cloned: false, error: err});
        } else {
          that.summary.cloned.push(project);
          that.logger.info(data);
          options.deferred.resolve({cloned: true, data: data});
        }
      });
    return options.deferred.promise;
  }

  /**
   * git pull project
   * @param {object} project - project name
   * @param {object} options - options
   * @param {retries} options.retries - current retry iteration in case it can't read from remote
   * @return {object} - promise
   * */
  pull(project, options) {
    const that = this;
    if (!options) {
      options = {
        retries: 0,
        deferred: q.defer(),
      };
    }
    if (options.retries === 0) {
      that.logger.log('info', `updating ${project}... Please wait`);
    }
    const folder = path.join(that.config.sources, project);
    git(folder)
      .pull((err, data) => {
        if (err) {
          if (options.retries < 2) {
            options.retries++;
            //that.logger.error(err);
            that.logger.error(`failed to pull ${project}, retrying ${options.retries} time...`);
            return that.pull(project, options);
          }
          that.logger.error(`failed to pull ${project}, aborting!`);
          that.summary.errors.push(`failed to pull ${project}`);
          options.deferred.resolve(err);
        } else {
          if (data.summary.changes > 0) {
            that.summary.updated.push(project);
          }
          that.logger.info(data);
          options.deferred.resolve(data);
        }
      });
    return options.deferred.promise;
  }

  /**
   * npm install cta repositories vendor node modules in same packages directory
   * @return {object} - promise
   * */
  install () {
    const that = this;
    const packages = {};
    Object.keys(that.config.repositories).forEach((name) => {
      const dir = path.join(that.config.sources, name);
      const pkgname = dir + path.sep + 'package.json';
      const pkg = jsonfile.readFileSync(pkgname);
      ['dependencies', 'devDependencies'].forEach(function(field) {
        const obj = pkg[field];
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && key.indexOf('cta-') !== 0) {
            packages[key] = true;
          }
        }
      });
    });
    that.logger.info('Installing packages: ', Object.keys(packages).sort().join(', '));
    process.chdir(that.config.packages);
    const promises = Object.keys(packages).map((pkg) => {
      return function() {
        const step = q.defer();
        that.logger.info(`running "npm install ${pkg}" in packages directory ${that.config.packages}`);
        const child = exec('npm install ' + pkg);
        child.stdout.on('data', function(log) {
          that.logger.log('silly', log);
          if (log.indexOf('ERR!') !== -1) {
            that.summary.errors.push(`Error with "npm install ${pkg}"`);
          }
        });
        child.stderr.on('data', function(log) {
          that.logger.log('silly', log);
          if (log.indexOf('ERR!') !== -1) {
            that.summary.errors.push(`Error with "npm install ${pkg}"`);
          }
        });
        child.on('close', function() {
          step.resolve();
        });
        return step.promise;
      }
    });
    return that.sequence(promises);
  }

  all(commands) {
    const that = this;
    that.init()
      .then(function() {
        if (commands.indexOf('clone') !== -1) {
          that.title('Cloning projects...');
          const promises = Object.keys(that.config.repositories).map(function (project) {
            return function () {
              return that.clone(project);
            };
          });
          return that.sequence(promises);
        } else {
          return Promise.resolve();
        }
      })
      .then(function() {
        if (commands.indexOf('pull') !== -1) {
          that.title('Updating projects...');
          const promises = Object.keys(that.config.repositories).map(function (project) {
            return function () {
              return that.pull(project);
            };
          });
          return that.sequence(promises);
        } else {
          return Promise.resolve();
        }
      })
      .then(function() {
        if (commands.indexOf('install') !== -1) {
          that.title('Installing packages...');
          return that.install();
        } else {
          return Promise.resolve();
        }
      })
      .catch(function(err) {
        that.logger.log('error', err);
      })
      .finally(function() {
        that.logger.info('');
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('# Finished.');
        that.summary.top.forEach((e) => {
          that.logger.info('# ' + e);
        });
        const cloned = that.summary.cloned.length > 0 ? that.summary.cloned.sort().join(', ') : 'none';
        that.logger.info(`# Cloned repositories (${that.summary.updated.length}): ${cloned}`);
        const updated = that.summary.updated.length > 0 ? that.summary.updated.sort().join(', ') : 'none';
        that.logger.info(`# Updated repositories (${that.summary.updated.length}): ${updated}`);
        const errors = that.summary.errors.length > 0 ? that.summary.errors.length : 'none';
        that.logger.info('# Errors: ' + errors);
        that.summary.errors.forEach((e) => {
          that.logger.info('# ' + e);
        });
        that.logger.info('# For more details see log file in:');
        that.logger.info('# ' + that.config.log);
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('');
      });
  }

  sequence (promises) {
    return promises.reduce(q.when, q());
  }
}

module.exports = Master;
