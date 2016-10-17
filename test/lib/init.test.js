'use strict';

const init = require('../../lib/init');
const path = require('path');
const os = require('os');
const assert = require('chai').assert;
const sinon = require('sinon');
const mkdirp = require('mkdirp');
const fs = require('fs');

describe('init', () => {
  const dir = path.join(os.tmpDir(), 'cta', String(Date.now()));
  after(() => {
    fs.rmdirSync(dir);
  });
  it("should create source dir when it doesn't exist", (done) => {
    const _sync = sinon.spy(mkdirp, 'sync');
    init(dir)
      .then((output) => {
        _sync.restore();
        sinon.assert.calledOnce(_sync);
        assert(output);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('should not create source dir when it already exists', (done) => {
    const _sync = sinon.spy(mkdirp, 'sync');
    init(dir)
      .then((output) => {
        _sync.restore();
        sinon.assert.notCalled(_sync);
        assert(output);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
