'use strict';

const o = require('../common');

describe('cta - master - init', function() {

  it('should create folders sources & packages when they do not exist', function(done) {
    o.sinon.stub(o.mkdirp, 'sync');
    o.sinon.stub(o.master.logger, 'log');
    o.sinon.stub(o.fs, 'createReadStream', () => {
      return { pipe: () => {} };
    });
    o.sinon.stub(o.tools, 'exists').returns(false);
    o.master.init()
      .then(() => {
        o.sinon.assert.calledTwice(o.mkdirp.sync);
        o.sinon.assert.called(o.fs.createReadStream);
        o.tools.exists.restore();
        o.mkdirp.sync.restore();
        o.master.logger.log.restore();
        o.fs.createReadStream.restore();
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should not create folders sources & packages when they already exist', function(done) {
    o.sinon.stub(o.mkdirp, 'sync');
    o.sinon.stub(o.master.logger, 'log');
    o.sinon.stub(o.fs, 'createReadStream', () => {
      return { pipe: () => {} };
    });
    o.sinon.stub(o.tools, 'exists').returns(true);
    o.master.init()
      .then(() => {
        o.sinon.assert.notCalled(o.mkdirp.sync);
        o.sinon.assert.called(o.fs.createReadStream);
        o.tools.exists.restore();
        o.mkdirp.sync.restore();
        o.master.logger.log.restore();
        o.fs.createReadStream.restore();
        done();
      })
      .catch((err) => {
        // console.log('error: ', err);
        done(err);
      });
  });

  it('should catch errors when they occurred', function(done) {
    o.sinon.stub(process, 'exit');
    o.sinon.stub(o.master.logger, 'log');
    o.sinon.stub(o.tools, 'exists', () => {
      throw new Error('some_error');
    });
    o.master.init()
      .then(() => {
        done('should not be here');
      })
      .catch((err) => {
        // console.log('error: ', err);
        o.assert.equal(err.message, 'some_error');
        o.master.logger.log.restore();
        o.tools.exists.restore();
        process.exit.restore();
        done();
      });
  });
});
