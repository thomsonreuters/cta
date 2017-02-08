'use strict';

const o = require('../common');

describe('cta - master.all', function() {

  const master = new o.Master(o.config);
  o.sinon.stub(master.logger, 'log');

  before(function() {
    o.sinon.stub(process, 'exit');
  });

  after(function() {
    process.exit.restore();
  });

  beforeEach(function() {
    o.sinon.stub(master, 'autoUpdate', () => {
      return o.q(false);
    });
    o.sinon.stub(master, 'init', () => {
      return o.q();
    });
    o.sinon.stub(master, 'clone', () => {
      return o.q();
    });
    o.sinon.stub(master, 'pull', () => {
      return o.q();
    });
    o.sinon.stub(master, 'install', () => {
      return o.q();
    });
    o.sinon.stub(master, 'title');
  });

  afterEach(function() {
    master.autoUpdate.restore();
    master.init.restore();
    master.clone.restore();
    master.pull.restore();
    master.install.restore();
    master.title.restore();
  });

  it('should run default commands', function(done) {
    master.all([])
      .then(() => {
        o.sinon.assert.calledOnce(master.autoUpdate);
        o.sinon.assert.calledOnce(master.init);
        o.sinon.assert.notCalled(master.clone);
        o.sinon.assert.notCalled(master.pull);
        o.sinon.assert.notCalled(master.install);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should run clone only', function(done) {
    master.summary.cloned = ['one', 'two'];
    master.all(['clone'])
      .then(() => {
        o.sinon.assert.calledOnce(master.autoUpdate);
        o.sinon.assert.calledOnce(master.init);
        o.sinon.assert.calledTwice(master.clone);
        o.sinon.assert.notCalled(master.pull);
        o.sinon.assert.notCalled(master.install);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should run pull only', function(done) {
    master.summary.updated = ['one', 'two'];
    master.all(['pull'])
      .then(() => {
        o.sinon.assert.calledOnce(master.autoUpdate);
        o.sinon.assert.calledOnce(master.init);
        o.sinon.assert.notCalled(master.clone);
        o.sinon.assert.calledTwice(master.pull);
        o.sinon.assert.notCalled(master.install);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should run install only', function(done) {
    master.all(['install'])
      .then(() => {
        o.sinon.assert.calledOnce(master.autoUpdate);
        o.sinon.assert.calledOnce(master.init);
        o.sinon.assert.notCalled(master.clone);
        o.sinon.assert.notCalled(master.pull);
        o.sinon.assert.calledOnce(master.install);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should run clone & install', function(done) {
    master.all(['clone', 'install'])
      .then(() => {
        o.sinon.assert.calledOnce(master.autoUpdate);
        o.sinon.assert.calledOnce(master.init);
        o.sinon.assert.calledTwice(master.clone);
        o.sinon.assert.notCalled(master.pull);
        o.sinon.assert.calledOnce(master.install);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should exit when autoUpdate returns changes', function(done) {
    master.autoUpdate.restore();
    o.sinon.stub(master, 'autoUpdate', () => {
      return o.q(true);
    });
    master.all([])
      .then(() => {
        o.sinon.assert.calledOnce(master.autoUpdate);
        o.sinon.assert.calledOnce(process.exit);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should log top summary when not empty', function(done) {
    master.summary.top.push('some_log');
    master.all([])
      .then(() => {
        o.sinon.assert.calledWith(master.logger.log, 'info', '# some_log');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should log conflicts when they exist', function(done) {
    master.summary.conflicts = {
      a: ['one', 'two']
    };
    master.all([])
      .then(() => {
        o.sinon.assert.calledWith(master.logger.log, 'warn', 'Conflicts on package name "a":', 'one, two');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should catch exceptions when they occurred', function(done) {
    master.autoUpdate.restore();
    o.sinon.stub(master, 'autoUpdate', () => {
      return o.q.reject('some_error');
    });
    master.all([])
      .then(() => {
        o.sinon.assert.calledWith(master.logger.log, 'error', 'some_error');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
