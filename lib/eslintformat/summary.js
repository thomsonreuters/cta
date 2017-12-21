/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const table = require('text-table');
const chalk = require('chalk');
const path = require('path');

module.exports = function (results) {
  const summary = {};
  const rules = {};
  results.forEach((result) => {
    // console.log(result);
    let repo;
    const arr = result.filePath.split(path.sep);
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      if (arr[i].indexOf('cta') === 0) {
        repo = arr[i];
        break;
      }
    }
    if (repo) {
      // console.log(`Checked repo ${repo}`);
      if (!(repo in summary)) {
        summary[repo] = {};
      }
      result.messages.forEach((message) => {
        rules[message.ruleId] = true;
        if (!(message.ruleId in summary[repo])) {
          summary[repo][message.ruleId] = 0;
        }
        summary[repo][message.ruleId] += 1;
      });
    }
  });
  const _rules = Object.keys(rules).sort();
  const head = [''];
  let i = 1;
  _rules.forEach(() => {
    head.push(`r${i}`);
    i += 1;
  });
  const rows = [head];
  Object.keys(summary).sort().forEach((repoName) => {
    const row = [repoName];
    _rules.forEach((ruleName) => {
      let value = summary[repoName][ruleName];
      if (value > 0) {
        value = chalk.red(value);
      }
      row.push(value);
    });
    rows.push(row);
  });
  let output = `\n${table(rows)}\n\nRules:`;
  i = 1;
  _rules.forEach((rule) => {
    output += `#${i}: ${rule}\n`;
    i += 1;
  });
  return output;
};
