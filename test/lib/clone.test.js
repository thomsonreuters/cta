'use strict';

const clone = require('../../lib/clone');
const path = require('path');
const os = require('os');
const rmdir = require('rmdir');

describe('clone', () => {
  const url = 'git@git.sami.int.thomsonreuters.com:compass/cta-io.git';
  const dir = path.join(os.tmpDir(), 'cta', String(Date.now()));
  after((done) => {
    rmdir(dir, (err) => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });
  it("should clone repository when destination doesn't exist", (done) => {
    clone(url, dir)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('should not clone repository when destination already exists', (done) => {
    clone(url, dir)
      .then(() => {
        done('should not be here');
      })
      .catch((err) => {
        done();
      });
  });
});
