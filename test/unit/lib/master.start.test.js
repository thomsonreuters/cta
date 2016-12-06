'use strict';

const o = require('../common');

describe('cta - master - start', function() {
  beforeEach(function() {
    o.sinon.stub(o.master, 'all', () => {});
  });

  afterEach(function() {
    o.master.all.restore();
  });

  it('should call start with clone command only', function() {
    o.master.start({c: true});
    o.sinon.assert.calledWith(o.master.all, ['clone']);
  });

  it('should call start with pull command only', function() {
    o.master.start({p: true});
    o.sinon.assert.calledWith(o.master.all, ['pull']);
  });

  it('should call start with install command only', function() {
    o.master.start({i: true});
    o.sinon.assert.calledWith(o.master.all, ['install']);
  });

  it('should call start with default commands', function() {
    o.master.start({});
    o.sinon.assert.calledWith(o.master.all, ['clone', 'install']);
  });
});
