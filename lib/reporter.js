/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

function Reporter(runner, options) {
  global.testData[options.project] = {
    passed: 0,
    failed: 0,
    total: 0,
    failures: [],
  };
  const data = global.testData[options.project];

  runner.on('pass', function () {
    data.passed += 1;
    data.total += 1;
  });

  runner.on('fail', function (test, err) {
    data.failed += 1;
    data.total += 1;
    data.failures.push(`${test.title}: ${err.message}`);
  });

  runner.on('end', function () {
    console.log('total: %d / passed: %d / failed: %d', data.total, data.passed, data.failed); // eslint-disable-line no-console
  });
}

exports = module.exports = Reporter;
