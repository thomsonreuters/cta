'use strict';

function Reporter(runner, options) {
  global.testData[options.project] = {
    passed: 0,
    failed: 0,
    total: 0,
    failures: [],
  };
  const data = global.testData[options.project];

  runner.on('pass', function(test) {
    data.passed++;
    data.total++;
  });

  runner.on('fail', function(test, err) {
    data.failed++;
    data.total++;
    data.failures.push(`${test.title}: ${err.message}`);
  });

  runner.on('end', function() {
    console.log('total: %d / passed: %d / failed: %d', data.total, data.passed, data.failed);
  });
}

exports = module.exports = Reporter;
