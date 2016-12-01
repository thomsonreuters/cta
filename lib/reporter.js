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
    console.log('total: %d / passed: %d / failed: %d', data.total, data.passed, data.failed);
  });
}

exports = module.exports = Reporter;
