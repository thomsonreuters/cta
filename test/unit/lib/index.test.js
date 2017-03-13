'use strict';

const o = require('../common');

describe('cta - index', function() {
  before(function() {
    o.sinon.stub(o.Master.prototype, 'start', () => {});
  });
  after(function() {
    o.Master.prototype.start.restore();
  });
  it('should call start method with passed arguments', function() {
    require('../../../lib/index');
    o.sinon.assert.called(o.Master.prototype.start);
  });
});
