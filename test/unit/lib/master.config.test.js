'use strict';

const o = require('../common');
const config = require('../../../config');

describe('cta - master - config', function() {
  describe('default config', function() {
    it('should export default config parameters', function () {
      o.assert.property(o.master.config, 'root');
      o.assert.property(o.master.config, 'sources');
      o.assert.property(o.master.config, 'packages');
      o.assert.property(o.master.config, 'log');
      o.assert.property(o.master.config, 'prefix');
      o.assert.property(o.master.config, 'repositories');
    });
  });
});
