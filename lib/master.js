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
          filename: conf.logs + path.sep + 'output.log',
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

  /**
   * Init working directory
   * @return {object} - promise
   */
  init () {
    const that = this;
    const deferred = q.defer();
    that.title('Init Base Directory...');
    that.logger.info(`Base Directory: ${that.config.sources}`);
    try {
      fs.access(that.config.sources, (err) => {
        if (!err) {
          that.logger.info(`Base Directory already exists`);
        } else {
          mkdirp.sync(that.config.sources);
          that.logger.info(`Created Base Directory`);
        }
        const globalEslint = that.config.sources + path.sep + '.eslintrc';
        const masterEslint = path.resolve(__dirname, '..') + path.sep + '.eslintrc';
        fs.createReadStream(masterEslint).pipe(fs.createWriteStream(globalEslint));
        that.logger.info(`Created/updated eslint in ${globalEslint}`);
        that.logger.info(`Working Base Directory is ${that.config.sources}`);
        that.summary.top.push(`Working Base Directory: ${that.config.sources}`);
        deferred.resolve();
      });
    } catch (e) {
      deferred.reject(e);
      that.logger.info(`Can't create directory ${that.config.sources}`);
      that.logger.info(e);
      process.exit(0);
    }
    return deferred.promise;
  }

  /**
   * clone all cta opensource repositories to local directory
   * @param {object} project - project name
   * @param {object} options - options
   * @param {retries} options.retries - current retry iteration in case it can't read from remote
   * @param {retryOn} options.retryOn - git clone output text to retry
   * @return {object} - promise
   * */
  clone (project, options) {
    const that = this;
    const deferred = q.defer();
    let promises = [];
    let retries = 0;
    let retryOn = 'Could not read from remote repository';
    let retry = false;
    if (typeof options === 'object') {
      if (!isNaN(options.retries)) {
        retries = options.retries;
      }
      if (options.retryOn) {
        retryOn = options.retryOn;
      }
      if (options.promises) {
        promises = options.promises;
      }
    }
    const dir = path.join(that.config.sources, project);
    that.logger.info(`Cloning project ${project}... Please wait`);
    fs.access(dir, (err1) => {
      if (!err1) {
        that.logger.info(`${project} already cloned, updating instead...`);
        that.pull(project)
          .then(function() {
            deferred.resolve({retries: retries});
          })
          .catch(function() {
            deferred.reject();
          });
      } else {
        process.chdir(that.config.sources);
        that.logger.info(`Cloning to ${dir}`);
        const child = exec(`git clone ${that.config.repositories[project]}`);
        child.stdout.on('data', function(log) {
          that.logger.log('silly', log);
          if (log.indexOf(retryOn) !== -1) {
            retry = true;
          }
        });
        child.stderr.on('data', function(log) {
          that.logger.log('silly', log);
          if (log.indexOf(retryOn) !== -1) {
            retry = true;
          }
        });
        child.on('close', function() {
          if (retry && retries < 2) {
            retries++;
            promises.push(deferred);
            return that.clone(project, {retries: retries, retryOn: retryOn, promises: promises});
          }
          fs.access(dir, (err2) => {
            if (!err2) {
              that.logger.info(`Project ${project} cloned`);
              that.summary.cloned.push(project);
            } else {
              that.logger.info(`git clone failed for ${project}`);
              that.summary.errors.push(`git clone failed for ${project}`);
            }
            if (promises.length) {
              promises.forEach((promise) => {
                promise.resolve({retries: retries});
              });
            } else {
              deferred.resolve({retries: retries});
            }
          });
        });
      }
    });
    return deferred.promise;
  }

  /**
   * git pull all cta opensource local repositories
   * @param {object} project - gitlab project object
   * @param {object} options - options
   * @param {retries} options.retries - current retry iteration in case it can't read from remote
   * @param {retryOn} options.retryOn - git pull output text to retry
   * @return {object} - promise
   * */
  pull (project, options) {
    const that = this;
    const deferred = q.defer();
    const logs = [];
    let promises = [];
    let retries = 0;
    let retryOn = 'Could not read from remote repository';
    let retry = false;
    if (typeof options === 'object') {
      if (!isNaN(options.retries)) {
        retries = options.retries;
      }
      if (options.retryOn) {
        retryOn = options.retryOn;
      }
      if (options.promises) {
        promises = options.promises;
      }
    }

    let error = false;
    let updated = true;
    try {
      that.logger.log('info', `updating ${project}... Please wait`);
      const dir = path.join(that.config.sources, project);
      process.chdir(dir);
      that.logger.log('info', `Working directory: ${dir}`);
      const child = exec(`git pull`);
      child.stdout.on('data', function(log) {
        logs.push(log);
        that.logger.log('silly', log);
        if (log.indexOf(retryOn) !== -1) {
          retry = true;
        } else {
          if (log.indexOf('error:') !== -1 || log.indexOf('fatal:') !== -1) {
            error = true;
            updated = false;
            that.summary.errors.push(`failed to update ${project}`);
          }
          if (log.indexOf('Already up-to-date') !== -1) {
            updated = false;
          }
        }
      });
      child.stderr.on('data', function(log) {
        logs.push(log);
        that.logger.log('silly', log);
        if (log.indexOf(retryOn) !== -1) {
          retry = true;
        } else {
          if (log.indexOf('error:') !== -1 || log.indexOf('fatal:') !== -1) {
            error = true;
            updated = false;
            that.summary.errors.push(`failed to update ${project}`);
          }
          if (log.indexOf('Already up-to-date') !== -1) {
            updated = false;
          }
        }
      });
      child.on('close', function() {
        if (retry && retries < 2) {
          retries++;
          promises.push(deferred);
          return that.pull(project, {retries: retries, retryOn: retryOn, promises: promises});
        }
        if (!error && updated) {
          that.logger.log('info', `Project ${project} updated`);
          that.summary.updated.push(project);
        }
        if (promises.length) {
          promises.forEach((promise) => {
            promise.resolve({retries: retries});
          });
        } else {
          deferred.resolve({retries: retries, logs: logs});
        }
      });
    } catch (e) {
      deferred.reject(e);
    }
    return deferred.promise;
  }

  /**
   * run npm install command inside all local cta opensource repositories
   * @param {string} project - project name
   * @return {object} - promise
   * */
  npmInstall (project) {
    const that = this;
    const deferred = q.defer();
    const dir = path.join(that.config.sources, project);
    fs.access(dir, (err) => {
      if (err) {
        that.logger.info(`${dir} is not a directory`);
        deferred.resolve();
        return deferred.promise;
      }
      try {
        that.logger.log('info', `Installing npm dependencies for project ${project}...`);
        that.logger.log('info', `Working directory: ${dir}`);
        const pkgname = dir + path.sep + 'package.json';
        const pkg = require(pkgname);
        const pkgCopy = _.cloneDeep(pkg);
        let edited = false;
        const arr = ['dependencies', 'devDependencies'];
        arr.forEach(function(field) {
          const obj = pkg[field];
          for (const key in obj) {
            if (obj.hasOwnProperty(key) && key.indexOf('cta-') === 0) {
              delete pkg[field][key];
              edited = true;
            }
          }
        });
        if (edited) {
          that.logger.log('info', `Found cta dependencies in package.json`);
          const pkgnameCopy = dir + path.sep + 'packageCopy.json';
          // fs.copySync(pkgname, pkgnameCopy);
          jsonfile.writeFileSync(pkgnameCopy, pkgCopy, {spaces: 2}, function(err2) {
            deferred.reject(err2);
          });
          that.logger.log('info', `Made copy of package.json in ${pkgnameCopy}`);
          that.logger.log('info', `Saving new package.json`);
          jsonfile.writeFileSync(pkgname, pkg, {spaces: 2}, function(err3) {
            deferred.reject(err3);
          });
        }
        process.chdir(dir);
        const child = exec('npm install');
        child.stdout.on('data', function(log) {
          that.logger.log('silly', log);
        });
        child.stderr.on('data', function(log) {
          that.logger.log('silly', log);
        });
        child.on('close', function() {
          that.logger.info(`npm dependencies installed for project ${project}`);
          deferred.resolve();
        });
      } catch (e) {
        deferred.reject(e);
      }
    });
    return deferred.promise;
  }

  /**
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
        that.logger.info(`running npm install ${pkg} on packages dir ${that.config.packages}`);
        const child = exec('npm install ' + pkg);
        child.stdout.on('data', function(log) {
          that.logger.log('silly', log);
        });
        child.stderr.on('data', function(log) {
          that.logger.log('silly', log);
        });
        child.on('close', function() {
          step.resolve();
        });
        return step.promise;
      }
    });
    return that.sequence(promises);
  }

  pullAll() {
    const that = this;
    const deferred = q.defer();
    const promises = Object.keys(that.config.repositories)
      .map(function(name) {
        return function() {
          return that.pull(name);
        };
      });
    that.sequence(promises)
      .then(function() {
        deferred.resolve();
      })
      .catch(function(err) {
        that.logger.log('error', err);
      })
      .progress(function() {
        that.logger.log('info', '*** Processing... Please wait ***');
      })
      .finally(function() {
        that.logger.info('');
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('# Finished.');
        that.summary.top.forEach((e) => {
          that.logger.info('# ' + e);
        });
        const updated = that.summary.updated.length > 0 ? that.summary.updated.sort().join(', ') : 'none';
        that.logger.info('# Updated repositories: ' + updated);
        const errors = that.summary.errors.length > 0 ? that.summary.errors.length : 'none';
        that.logger.info('# Errors: ' + errors);
        that.summary.errors.forEach((e) => {
          that.logger.info('# ' + e);
        });
        that.logger.info('# For more details see log file in:');
        that.logger.info('# ' + that.config.logFile);
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('');
      });
    return deferred.promise;
  }

  /**
   * run many promises in a sequence
   * @param {Array} - Array of promises
   * @return {object} - promise
   * */
  sequence (promises) {
    return promises.reduce(q.when, q());
  }

  /**
   * start point
   * */
  start () {
    const that = this;
    that.summary.top.push('Start');
    that.init()
      .then(function() {
        that.title('Cloning projects...');
        const promises = Object.keys(that.config.repositories).map(function(project) {
          return function() {
            return that.clone(project);
          };
        });
        return that.sequence(promises);
      })
      .then(function() {
        that.title('Installing node dependencies...');
        return that.install();
      })
      /*.then(function() {
        that.title('Installing node dependencies...');
        const promises = Object.keys(that.config.repositories).map(function(project) {
          return function() {
            return that.npmInstall(project);
          };
        });
        return that.sequence(promises);
      })*/
      .catch(function(err) {
        that.logger.log('error', err);
      })
      .progress(function() {
        that.logger.log('info', '*** Processing... Please wait ***');
      })
      .finally(function() {
        that.logger.info('');
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('# Finished.');
        that.summary.top.forEach((e) => {
          that.logger.info('# ' + e);
        });
        const cloned = that.summary.cloned.length > 0 ? that.summary.cloned.sort().join(', ') : 'none';
        that.logger.info('# Cloned repositories: ' + cloned);
        const updated = that.summary.updated.length > 0 ? that.summary.updated.sort().join(', ') : 'none';
        that.logger.info('# Updated repositories: ' + updated);
        const errors = that.summary.errors.length > 0 ? that.summary.errors.length : 'none';
        that.logger.info('# Errors: ' + errors);
        that.summary.errors.forEach((e) => {
          that.logger.info('# ' + e);
        });
        that.logger.info('# For more details see log file in:');
        that.logger.info('# ' + that.config.logFile);
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('');
      });
  }
}

module.exports = Master;
