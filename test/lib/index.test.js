'use strict';

const init = require('../../lib/init');
const clone = require('../../lib/clone');
const pull = require('../../lib/pull');
const install = require('../../lib/install');

const path = require('path');
const os = require('os');
const assert = require('chai').assert;
const sinon = require('sinon');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
const fs = require('fs');

const base = path.join(os.tmpDir(), 'cta', String(Date.now()));
const test = {
  base: base,
  project: path.join(base, 'cta-repo-sample'),
  url: 'git@git.sami.int.thomsonreuters.com:compass/cta-repo-sample.git',
};

describe('tests', () => {
  /*after((done) => {
    rmdir(base, (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });*/

  describe('init', () => {
    it("should create source dir when it doesn't exist", (done) => {
      const _sync = sinon.spy(mkdirp, 'sync');
      init(test.base)
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
      init(test.base)
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

  describe('clone', () => {
    it("should clone repository when destination doesn't exist", (done) => {
      clone(test.url, test.base)
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('should not clone repository when destination already exists', (done) => {
      clone(test.url, test.base)
        .then(() => {
          done('should not be here');
        })
        .catch((err) => {
          done();
        });
    });
  });

  describe('pull', () => {
    it('should pull folder when it is a git repository', (done) => {
      pull(test.project)
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it('should not pull repository when it is not a git repo', (done) => {
      pull(os.tmpDir())
        .then(() => {
          done('should not be here');
        })
        .catch((err) => {
          done();
        });
    });
  });

  describe('install', () => {
    it('should run npm install on cloned git repository', (done) => {
      install(test.project)
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    }).timeout(60000);
    it('should not pull repository when it is not a git repo', (done) => {
      pull(os.tmpDir())
        .then(() => {
          done('should not be here');
        })
        .catch((err) => {
          done();
        });
    });
  });
});
