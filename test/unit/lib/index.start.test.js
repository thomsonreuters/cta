'use strict';

const Master = require('../../../lib/master');
const sinon = require('sinon');
const config = require('./config.testdata');
const master = new Master(config);

describe('cta - master - start', function() {
  beforeEach(function() {
    sinon.stub(master, 'all', () => {});
  });

  afterEach(function() {
    master.all.restore();
  });

  it('should call start with clone command only', function() {
    master.start({c: true});
    sinon.assert.calledWith(master.all, ['clone']);
  });

  it('should call start with pull command only', function() {
    master.start({p: true});
    sinon.assert.calledWith(master.all, ['pull']);
  });

  it('should call start with install command only', function() {
    master.start({i: true});
    sinon.assert.calledWith(master.all, ['install']);
  });
});
