'use strict';

const common = require('../../../lib/common');
const assert = require('chai').assert;
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

describe('cta - common', function() {
  it('isCtaDir', function() {
    assert.isNotOk(common.isCtaDir('foo'));
    assert.isNotOk(common.isCtaDir(true));
    assert.isOk(common.isCtaDir('cta-foo'));
  });

  describe('explore', function() {
    before(function() {
      sinon.stub(fs, 'readdirSync')
        .withArgs('basedir')
        .returns(['cta-foo', 'cta-bar', 'somedir']);
      sinon.stub(fs, 'statSync')
        .returns({ isDirectory: () => { return true; } });
    });
    after(function() {
      fs.readdirSync.restore();
      fs.statSync.restore();
    });
    it('should return cta directories', function() {
      const result = common.explore('basedir');
      assert.sameMembers(result, ['cta-foo', 'cta-bar']);
    });
  });

  it('exists', function() {
    let result = common.exists(__dirname);
    assert.isOk(result);
    result = common.exists(path.join(__dirname, String(Date.now())));
    assert.isNotOk(result);
  });

  it('isDir', function() {
    let result = common.isDir(__dirname);
    assert.isOk(result);
    result = common.isDir(path.join(__dirname, String(Date.now())));
    assert.isNotOk(result);
    result = common.isDir(__filename);
    assert.isNotOk(result);
  });

  it('isFile', function() {
    let result = common.isFile(__filename);
    assert.isOk(result);
    result = common.isFile(path.join(__dirname, String(Date.now())));
    assert.isNotOk(result);
    result = common.isFile(__dirname);
    assert.isNotOk(result);
  });

});
