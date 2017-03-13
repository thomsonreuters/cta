'use strict';

const o = require('../common');

describe('cta - master - autoUpdate', function() {

  const requireSubvert = require('require-subvert')(__dirname);

  after(function() {
    requireSubvert.cleanUp();
  });

  it('should log error when it fails', function(done) {
    const fn = () => {
      return {
        pull: (cb) => {
          cb('some_error', null);
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.autoUpdate()
      .then((data) => {
        // console.log('data: ', data);
        o.assert.strictEqual(data, 'some_error');
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should retry twice when it could not read from remote repository', function(done) {
    const fn = () => {
      return {
        pull: (cb) => {
          cb('Could not read from remote repository', null);
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.autoUpdate()
      .then((data) => {
        // console.log('data: ', data);
        o.assert.strictEqual(data, 'Could not read from remote repository');
        // TODO improve this test to track all calls to method autoUpdate
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should log changes when update succeed', function(done) {
    const fn = () => {
      return {
        pull: (cb) => {
          cb(null, {
            summary: {
              changes: 2,
            },
          });
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.autoUpdate()
      .then((data) => {
        // TODO improve this test to check output logs
        o.assert.strictEqual(data, true);
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should log no changes when update succeed', function(done) {
    const fn = () => {
      return {
        pull: (cb) => {
          cb(null, {
            summary: {
              changes: 0,
            },
          });
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.autoUpdate()
      .then((data) => {
        // TODO improve this test to check output logs
        o.assert.strictEqual(data, false);
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });
});
