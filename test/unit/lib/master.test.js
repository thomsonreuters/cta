'use strict';

const o = require('../common');

describe('cta - master', function() {
  beforeEach(function() {
    o.sinon.stub(o.master.logger, 'info');
  });

  afterEach(function() {
    o.master.logger.info.restore();
  });

  it('title', function() {
    o.master.title('foo');
    o.sinon.assert.called(o.master.logger.info);
  });
});
