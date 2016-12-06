'use strict';

const o = require('../common');

describe('cta - tools', function() {
  it('isCtaDir', function() {
    o.assert.isNotOk(o.tools.isCtaDir('foo'));
    o.assert.isNotOk(o.tools.isCtaDir(true));
    o.assert.isOk(o.tools.isCtaDir('cta-foo'));
  });

  describe('explore', function() {
    before(function() {
      o.sinon.stub(o.fs, 'readdirSync')
        .withArgs('basedir')
        .returns(['cta-foo', 'cta-bar', 'somedir']);
      o.sinon.stub(o.fs, 'statSync')
        .returns({ isDirectory: () => { return true; } });
    });
    after(function() {
      o.fs.readdirSync.restore();
      o.fs.statSync.restore();
    });
    it('should return cta directories', function() {
      const result = o.tools.explore('basedir');
      o.assert.sameMembers(result, ['cta-foo', 'cta-bar']);
    });
  });

  it('exists', function() {
    let result = o.tools.exists(__dirname);
    o.assert.isOk(result);
    result = o.tools.exists(o.path.join(__dirname, String(Date.now())));
    o.assert.isNotOk(result);
  });

  it('isDir', function() {
    let result = o.tools.isDir(__dirname);
    o.assert.isOk(result);
    result = o.tools.isDir(o.path.join(__dirname, String(Date.now())));
    o.assert.isNotOk(result);
    result = o.tools.isDir(__filename);
    o.assert.isNotOk(result);
  });

  it('isFile', function() {
    let result = o.tools.isFile(__filename);
    o.assert.isOk(result);
    result = o.tools.isFile(o.path.join(__dirname, String(Date.now())));
    o.assert.isNotOk(result);
    result = o.tools.isFile(__dirname);
    o.assert.isNotOk(result);
  });

});
