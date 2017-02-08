'use strict';

const o = require('../common');
const childProcess = require('child_process');
const EventEmitter = require('events');

describe('cta - master.install', function() {

  const master = new o.Master(o.config);

  describe('one', function() {
    it('should catch errors when they occured', function(done) {
      o.sinon.stub(o.path, 'resolve', () => {
        throw new Error('some_error');
      });
      master.install()
        .then(() => {
          // o.assert.strictEqual(data, false);
          done('should not be here');
        })
        .catch((err) => {
          // console.log('error: ', err);
          o.assert.strictEqual(err, 'some_error');
          o.path.resolve.restore();
          done();
        });
    });
  });

  describe('two', function() {

    let temp = {};
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    o.sinon.stub(childProcess, 'exec', () => { return child; });

    before(function() {
      o.sinon.stub(o.fs, 'copySync');
      o.sinon.stub(o.fs, 'removeSync');
      o.sinon.stub(process, 'chdir');
      o.sinon.stub(master.logger, 'log');
      o.sinon.stub(o.jsonfile, 'writeFileSync', (filepath, data) => {
        if (filepath === o.path.resolve(master.config.root, 'package.json')) {
          temp = data;
        }
      });
      o.sinon.stub(o.jsonfile, 'readFileSync')
        .withArgs(o.path.resolve(o.rootDir, 'package.json'))
        .returns({})
        .withArgs(o.path.resolve(master.config.sources, 'one', 'package.json'))
        .returns({
          dependencies: {
            d1: '^1.6',
            d2: '~2.2'
          },
          devDependencies: {
            v1: '~1.3',
            v2: '2.6'
          }
        })
        .withArgs(o.path.resolve(master.config.sources, 'two', 'package.json'))
        .returns({
          dependencies: {
            d2: '2.4',
            d3: '3.1'
          },
          devDependencies: {
            v1: '1.1',
            v3: '3.0'
          }
        });
    });

    after(function() {
      o.fs.copySync.restore();
      o.fs.removeSync.restore();
      process.chdir.restore();
      o.jsonfile.writeFileSync.restore();
      o.jsonfile.readFileSync.restore();
    });

    it('when all is ok', function(done) {
      setTimeout(() => {
        child.stdout.emit('data', 'some stdout ERR!');
        setTimeout(() => {
          child.stderr.emit('data', 'some stderr ERR!');
          setTimeout(() => {
            child.emit('close');
          }, 10);
        }, 10);
      }, 50);
      master.install()
        .then(() => {
          done();
        })
        .catch((err) => {
          // console.log('error: ', err);
          done(err);
        });
    });

    it('when one repo has no dependencies', function(done) {
      o.jsonfile.readFileSync.restore();
      o.sinon.stub(o.jsonfile, 'readFileSync')
        .withArgs(o.path.resolve(o.rootDir, 'package.json'))
        .returns({})
        .withArgs(o.path.resolve(master.config.sources, 'one', 'package.json'))
        .returns({
          dependencies: {
            d1: '^1.6',
            d2: '~2.2'
          },
          devDependencies: {
            v1: '~1.3',
            v2: '2.6'
          }
        })
        .withArgs(o.path.resolve(master.config.sources, 'two', 'package.json'))
        .returns({});
      setTimeout(() => {
        child.stdout.emit('data', 'some stdout ERR!');
        setTimeout(() => {
          child.stderr.emit('data', 'some stderr ERR!');
          setTimeout(() => {
            child.emit('close');
          }, 10);
        }, 10);
      }, 50);
      master.install()
        .then(() => {
          done();
        })
        .catch((err) => {
          // console.log('error: ', err);
          done(err);
        });
    });

    it('when it can not generate temporary package.json', function(done) {
      o.jsonfile.writeFileSync.restore();
      o.sinon.stub(o.jsonfile, 'writeFileSync', (filepath, data, options, cb) => {
        cb('some_error');
      });
      master.install()
        .then(() => {
          done('should not be here');
        })
        .catch((err) => {
          // console.log('error: ', err);
          o.assert.strictEqual(err, 'some_error');
          done();
        });
    });

    it('when it can not generate installed packages', function(done) {
      o.jsonfile.writeFileSync.restore();
      o.sinon.stub(o.jsonfile, 'writeFileSync', (filepath, data, options, cb) => {
        if (filepath === o.path.resolve(master.config.root, 'package.json')) {
          temp = data;
        } else {
          cb('some_error');
        }
      });
      master.install()
        .then(() => {
          done('should not be here');
        })
        .catch((err) => {
          // console.log('error: ', err);
          o.assert.strictEqual(err, 'some_error');
          done();
        });
    });
  });
});
