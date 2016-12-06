'use strict';

const Master = require('../../../lib/master');
const sinon = require('sinon');

describe('cta - index', function() {
  before(function() {
    sinon.stub(Master.prototype, 'start', () => {});
  });
  after(function() {
    Master.prototype.start.restore();
  });
  it('should call start method with passed arguments', function() {
    require('../../../lib/index');
    sinon.assert.called(Master.prototype.start);
  });
});
