'use strict';

const o = require('../common');
const childProcess = require('child_process');
const EventEmitter = require('events');

describe('cta - master - install', function() {

  const requireSubvert = require('require-subvert')(__dirname);

  after(function() {
    requireSubvert.cleanUp();
  });

  it('should catch errors when they occured', function(done) {
    o.sinon.stub(o.path, 'resolve', () => {
      throw new Error('some_error');
    });
    o.master.install()
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

  it('todo', function(done) {
    o.sinon.stub(o.master.logger, 'log');
    o.sinon.stub(o.fs, 'copySync');
    o.sinon.stub(o.fs, 'removeSync');
    o.sinon.stub(o.jsonfile, 'readFileSync')
      .withArgs(o.path.resolve(o.rootDir, 'package.json'))
      .returns({})
      .withArgs(o.path.resolve(o.master.config.sources, 'one', 'package.json'))
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
      .withArgs(o.path.resolve(o.master.config.sources, 'two', 'package.json'))
      .returns({
        dependencies: {
          d2: '2.4',
          d3: '3.1'
        },
        devDependencies: {
          v1: '1.6',
          v3: '3.0'
        }
      });
    let temp = {};
    o.sinon.stub(o.jsonfile, 'writeFileSync', (filepath, data) => {
      if (filepath === o.path.resolve(o.master.config.root, 'package.json')) {
        temp = data;
      }
    });
    o.sinon.stub(process, 'chdir');
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    o.sinon.stub(childProcess, 'exec', () => { return child; });
    setTimeout(() => { child.emit('close'); }, 500);
    o.master.install()
      .then(() => {
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });
});
