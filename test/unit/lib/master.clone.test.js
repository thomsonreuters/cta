'use strict';

const o = require('../common');

describe('cta - master - clone', function() {

  const requireSubvert = require('require-subvert')(__dirname);

  after(function() {
    requireSubvert.cleanUp();
  });

  it('should update instead when folder already exists and is not empty', function(done) {
    const fn = () => {
      return {
        clone: (url, name, cb) => {
          cb('already exists and is not an empty directory', null);
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master, 'pull', (project, options) => {
      options.deferred.resolve();
    });
    o.sinon.stub(master.logger, 'log');
    master.clone('one', null)
      .then(() => {
        // console.log('data: ', data);
        o.sinon.assert.calledOnce(master.pull);
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
        clone: (url, name, cb) => {
          cb('some_error', null);
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.clone('one', null)
      .then((data) => {
        // console.log('data: ', data);
        o.assert.deepEqual(data, {cloned: false, error: 'some_error'});
        // TODO improve this test to track all calls to method autoUpdate
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should return clone result when done', function(done) {
    const fn = () => {
      return {
        clone: (url, name, cb) => {
          cb(null, 'some_data');
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.clone('one', null)
      .then((data) => {
        // console.log('data: ', data);
        o.assert.deepEqual(data, {cloned: true, data: 'some_data'});
        // TODO improve this test to track all calls to method autoUpdate
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should catch errors when they occurred', function(done) {
    const fn = () => {
      return {
        clone: () => {
          throw new Error('some_error');
        },
      };
    };
    requireSubvert.subvert('simple-git', fn);
    const Master = requireSubvert.require('../../../lib/master');
    const master = new Master(o.config);
    o.sinon.stub(master.logger, 'log');
    master.clone('one', null)
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
