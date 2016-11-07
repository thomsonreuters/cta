'use strict';

const path = require('path');
const os = require('os');
const assert = require('chai').assert;
const sinon = require('sinon');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
const fs = require('fs');

const root = path.join(os.tmpDir(), 'cta', String(Date.now()));
const config = {
  root: root,
  sources: path.resolve(root, 'src', 'node_modules'),
  packages: path.resolve(root, 'node_modules'),
  log: path.resolve(root, 'output.log'),
  repositories: {
    one: 'git@git.sami.int.thomsonreuters.com:compass/cta-sampleone.git',
    two: 'git@git.sami.int.thomsonreuters.com:compass/cta-sampletwo.git'
  },
};

const Master = require('../../lib/master');
const master = new Master(config);

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
      master.init()
        .then(() => {
          _sync.restore();
          sinon.assert.calledTwice(_sync);
          assert.isOk(fs.existsSync(master.config.sources));
          assert.isOk(fs.existsSync(master.config.packages));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('clone', () => {
    it("should clone repository one", (done) => {
      master.clone('one')
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    it("should clone repository two", (done) => {
      master.clone('two')
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('pull', () => {
    it('should pull folder when it is a git repository', (done) => {
      master.pull('one')
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('install', () => {
    it('should install npm dependencies', (done) => {
      master.install()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    }).timeout(60000);
  });
});
