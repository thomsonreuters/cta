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
          filename: conf.log + '.' + new Date().toISOString().replace(/:/g, '-'),
          level: 'silly',
        }),
      ],
    });
    this.summary = {
      top: [],
      cloned: [],
      updated: [],
      errors: [],
      conflicts: {},
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

  autoUpdate(options) {
    const that = this;
    if (!options) {
      options = {
        retries: 0,
        deferred: q.defer(),
      };
    }
    if (options.retries === 0) {
      that.logger.log('info', `Auto updating CTA... Please wait`);
    }
    const folder = path.resolve(__dirname, '..');
    git(folder)
      .pull((err, data) => {
        if (err) {
          if (err.indexOf('Could not read from remote repository') !== -1 && options.retries < 2) {
            options.retries++;
            that.logger.error(`Failed to pull CTA, retrying ${options.retries} time...`);
            return that.autoUpdate(options);
          }
          that.logger.error(`Failed to pull CTA, aborting!`);
          options.deferred.reject(err);
        } else {
          if (data.summary.changes > 0) {
            that.logger.info('Changes: ', data);
            that.logger.info('Changes detected on CTA, please run "npm install" again');
          } else {
            that.logger.info('No changes detected');
          }
          options.deferred.resolve(data.summary.changes > 0);
        }
      });
    return options.deferred.promise;
  }

  /**
   * Init working directory
   * @return {object} - promise
   */
  init() {
    // return Promise.resolve();
    const that = this;
    const deferred = q.defer();
    that.title('Init sources Directory...');
    that.logger.info(`Sources directory is: ${that.config.sources}`);
    co(function * coroutine() {
      const sourcesExists = yield that.exists(that.config.sources);
      if (sourcesExists) {
        that.logger.info(`Sources directory already exists`);
      } else {
        mkdirp.sync(that.config.sources);
        that.logger.info(`Created sources directory`);
      }
      that.logger.info(`Packages directory is: ${that.config.packages}`);
      const packagessExists = yield that.exists(that.config.packages);
      if (packagessExists) {
        that.logger.info(`Packages directory already exists`);
      } else {
        mkdirp.sync(that.config.packages);
        that.logger.info(`Created packages directory`);
      }
      const globalEslint = that.config.sources + path.sep + '.eslintrc';
      const masterEslint = path.resolve(__dirname, '..') + path.sep + '.eslintrc';
      fs.createReadStream(masterEslint).pipe(fs.createWriteStream(globalEslint));
      that.logger.info(`Created/updated eslint in ${globalEslint}`);
      that.summary.top.push(`Sources directory: ${that.config.sources}`);
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
    // return Promise.resolve();
    const that = this;
    const deferred = q.defer();
    try {
    if (!options) {
      options = {
        retries: 0,
        deferred: deferred,
      };
    }
    if (options.retries === 0) {
      that.logger.info(`Cloning ${project}... Please wait`);
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
            that.logger.error(`Failed to clone ${project}, retrying ${options.retries} time...`);
            return that.clone(project, options);
          }
          that.logger.error(`Failed to clone ${project}, aborting!`);
          that.summary.errors.push(`Failed to clone ${project}`);
          options.deferred.resolve({cloned: false, error: err});
        } else {
          that.summary.cloned.push(project);
          that.logger.info('done. ', data);
          options.deferred.resolve({cloned: true, data: data});
        }
      });
    } catch (e) {
      deferred.reject(e);
    }
    return deferred.promise;
  }

  /**
   * git pull project
   * @param {object} project - project name
   * @param {object} options - options
   * @param {retries} options.retries - current retry iteration in case it can't read from remote
   * @return {object} - promise
   * */
  pull(project, options) {
    // return Promise.resolve();
    const that = this;
    const deferred = q.defer();
    try {
      if (!options) {
        options = {
          retries: 0,
          deferred: deferred,
        };
      }
      if (options.retries === 0) {
        that.logger.info(`Updating ${project}... Please wait`);
      }
      const folder = path.join(that.config.sources, project);
      git(folder)
        .pull((err, data) => {
          if (err) {
            if (err.indexOf('Could not read from remote repository') !== -1 && options.retries < 2) {
              options.retries++;
              //that.logger.error(err);
              that.logger.error(`Failed to pull ${project}, retrying ${options.retries} time...`);
              return that.pull(project, options);
            }
            that.logger.error(`Failed to pull ${project}, aborting!`);
            that.summary.errors.push(`Failed to pull ${project}`);
            options.deferred.resolve(err);
          } else {
            if (data.summary.changes > 0) {
              that.summary.updated.push(project);
              that.logger.info('Changes: ', data);
            } else {
              that.logger.info('No changes detected');
            }
            options.deferred.resolve(data);
          }
        });
    } catch (e) {
      deferred.reject(e);
    }
    return deferred.promise;
  }

  /**
   * npm install cta repositories vendor node modules in same packages directory
   * @return {object} - promise
   * */
  install() {
    const that = this;
    const deferred = q.defer();
    try {
      const packages = {};
      const ctaPkgName = path.resolve(__dirname, '..', 'package.json');
      const ctaPkgBakName = path.resolve(__dirname, '..', 'package.bak.json');
      const ctaPkgInstalledName = path.resolve(__dirname, '..', 'package.installed.json');
      const ctaPkg = jsonfile.readFileSync(ctaPkgName);
      jsonfile.writeFileSync(ctaPkgBakName, ctaPkg, {spaces: 2}, function(err) {
        throw new Error(err);
      });
      ctaPkg.scripts = {};
      ctaPkg.devDependencies = {};
      ctaPkg.dependencies = {};
      Object.keys(that.config.repositories).forEach((name) => {
        const dir = path.join(that.config.sources, name);
        const pkgname = dir + path.sep + 'package.json';
        const pkg = jsonfile.readFileSync(pkgname);
        ['dependencies', 'devDependencies'].forEach(function(element) {
          const dependencies = pkg[element];
          for (const dependency in dependencies) {
            // if it is not cta dependency
            if (dependencies.hasOwnProperty(dependency) && dependency.indexOf(that.config.prefix) !== 0) {
              const version = dependencies[dependency];
              if (!(dependency in that.summary.conflicts)) {
                that.summary.conflicts[dependency] = [];
              }
              const pkgVersion = name + ': ' + version;
              if (that.summary.conflicts[dependency].indexOf(pkgVersion) === -1) {
                that.summary.conflicts[dependency].push(pkgVersion);
              }
              if (dependency in ctaPkg.dependencies && ctaPkg.dependencies[dependency] !== version) {
                // taking highest version
                const oldVersion = ctaPkg.dependencies[dependency].replace(/~|\^/g, '');
                const newVersion = version.replace(/~|\^/g, '');
                ctaPkg.dependencies[dependency] = oldVersion > newVersion ? oldVersion : newVersion;
              } else {
                ctaPkg.dependencies[dependency] = version;
              }
            }
          }
        });
      });
      jsonfile.writeFileSync(ctaPkgName, ctaPkg, {spaces: 2}, function(err) {
        throw new Error(err);
      });
      that.logger.info('Installing packages: ', Object.keys(packages).sort().join(', '));
      process.chdir(path.resolve(__dirname, '..'));
      // TODO const child = exec('npm install');
      const child = exec('npm install');
      child.stdout.on('data', function(log) {
        that.logger.log('silly', log);
        if (log.indexOf('ERR!') !== -1) {
          that.summary.errors.push(`Error with "npm install"`);
        }
      });
      child.stderr.on('data', function(log) {
        that.logger.log('silly', log);
        if (log.indexOf('ERR!') !== -1) {
          that.summary.errors.push(`Error with "npm install"`);
        }
      });
      child.on('close', function() {
        // save list of installed packages
        jsonfile.writeFileSync(ctaPkgInstalledName, jsonfile.readFileSync(ctaPkgName), {spaces: 2}, function(err) {
          throw new Error(err);
        });
        // restore main package.json
        jsonfile.writeFileSync(ctaPkgName, jsonfile.readFileSync(ctaPkgBakName), {spaces: 2}, function(err) {
          throw new Error(err);
        });
        // clear backup package.json
        fs.unlinkSync(ctaPkgBakName);
        deferred.resolve();
      });
    } catch (e) {
      deferred.reject(e);
    }
    return deferred.promise;
  }

  all(commands) {
    const that = this;
    that.autoUpdate()
      .then((updated) => {
        if (updated === true) {
          process.exit(0);
        }
        return Promise.resolve();
      })
      .then(function() {
        return that.init();
      })
      .then(function() {
        if (commands.indexOf('clone') !== -1) {
          that.title('Cloning projects...');
          const promises = Object.keys(that.config.repositories).map(function (project) {
            return function() {
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
            return function() {
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
        that.summary.errors.push(err);
      })
      .finally(function() {
        that.logger.info('');
        that.logger.info('# --------------------------------------------------------------- #');
        that.logger.info('# Finished.');
        that.summary.top.forEach((e) => {
          that.logger.info('# ' + e);
        });
        const cloned = that.summary.cloned.length > 0 ? that.summary.cloned.sort().join(', ') : 'none';
        that.logger.info(`# Cloned repositories (${that.summary.cloned.length}): ${cloned}`);
        const updated = that.summary.updated.length > 0 ? that.summary.updated.sort().join(', ') : 'none';
        that.logger.info(`# Updated repositories (${that.summary.updated.length}): ${updated}`);
        that.logger.info('# Packages versions conflicts :');
        Object.keys(that.summary.conflicts).forEach((dependency) => {
          const conflicts = that.summary.conflicts[dependency];
          if (conflicts.length > 1) {
            that.logger.warn(`Conflicts on package name "${dependency}":`, conflicts.join(', '));
          }
        });
        const errors = that.summary.errors.length > 0 ? that.summary.errors.length : 'none';
        that.logger.info('# Errors: ' + errors);
        let i = 1;
        that.summary.errors.forEach((e) => {
          that.logger.info(`# ${i}.`, e);
          i++;
        });
        that.logger.info('# See installed packages on file ./package.installed.json');
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
