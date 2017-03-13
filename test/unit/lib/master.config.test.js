'use strict';

const o = require('../common');
const requireSubvert = require('require-subvert')(__dirname);
const customConfigPath = o.path.resolve(__dirname, '../../../config/config.js');

describe('cta - master - config', function() {
  describe('default config', function() {
    after(function() {
      requireSubvert.cleanUp();
    });
    it('should export default config parameters', function () {
      const config = requireSubvert.require('../../../config/index.js');
      o.assert.property(o.master.config, 'root');
      o.assert.property(o.master.config, 'sources');
      o.assert.property(o.master.config, 'packages');
      o.assert.property(o.master.config, 'log');
      o.assert.property(o.master.config, 'prefix');
      o.assert.property(o.master.config, 'repositories');

      o.assert.strictEqual(config.root, o.path.resolve(__dirname, '../../..'));
      o.assert.strictEqual(config.sources, o.path.resolve(__dirname, '../../../src/node_modules'));
      o.assert.strictEqual(config.packages, o.path.resolve(__dirname, '../../../node_modules'));
      o.assert.strictEqual(config.log, o.path.resolve(__dirname, '../../../logs/output.log'));
      o.assert.strictEqual(config.prefix, 'cta-');
    });
  });

  describe('custom config', function() {
    before(function() {
      o.sinon.stub(o.fs, 'statSync')
        .returns({ isFile: () => { return true; } });
      o.fs.linkSync(o.path.join(__dirname,'config.custom.testdata.js'), customConfigPath);
    });
    after(function() {
      o.fs.statSync.restore();
      o.fs.unlinkSync(customConfigPath);
      requireSubvert.cleanUp();
    });
    it('should override default config parameters with custom settings', function () {
      // const config = require('../../../config');
      const config = requireSubvert.require('../../../config/index.js');
      o.assert.strictEqual(config.root, 'some_root');
      o.assert.strictEqual(config.sources, 'some_sources');
      o.assert.strictEqual(config.packages, 'some_packages');
      o.assert.strictEqual(config.log, 'some_log');
      o.assert.strictEqual(config.prefix, 'some_prefix');
      o.assert.deepEqual(config.repositories, { some: 'repositories' });
    });
  });
});
