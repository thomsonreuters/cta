'use strict';

const o = require('../common');

describe('cta - master - autoUpdate', function() {
  beforeEach(function() {
    o.sinon.stub(o.master.logger, 'log');
  });

  afterEach(function() {
    o.master.logger.log.restore();
  });

  it('pull', function(done) {
    const service = { git: o.git };
    o.sinon.stub(service, 'git', () => {
      return {
        pull: (cb) => {
          cb('some_error', null);
        },
      };
    });
    o.master.autoUpdate()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
