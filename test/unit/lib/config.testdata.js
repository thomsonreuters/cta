'use strict';

const path = require('path');
const os = require('os');
const root = path.join(os.tmpDir(), 'cta', String(Date.now()));

module.exports = {
  root: root,
  sources: path.resolve(root, 'src', 'node_modules'),
  packages: path.resolve(root, 'node_modules'),
  log: path.resolve(root, 'output.log'),
  prefix: 'cta-',
  repositories: {
    one: 'git@github.com:thomsonreuters/cta-sampleone.git',
    two: 'git@github.com:thomsonreuters/cta-sampletwo.git'
  },
};
