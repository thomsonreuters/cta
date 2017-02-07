'use strict';

const o = require('../common');
const requireSubvert = require('require-subvert')(__dirname);

describe('cta - master - autoUpdate', function() {
  beforeEach(function() {
    o.sinon.stub(o.master.logger, 'log');
  });

  afterEach(function() {
    o.master.logger.log.restore();
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

  it('should retry when twice when it could not read from remote repository', function(done) {
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
});
