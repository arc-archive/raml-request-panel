#!/usr/bin/env node

'use strict';

process.title = 'arc-ci';
var branch = process.env.TRAVIS_BRANCH;
var continueCi = true;
if (branch && branch !== 'stage') {
  continueCi = false;
  console.log('Not in stage branch. Wil not continue.');
}
if (branch) {
  const http = require('http');
  const options = {
    port: 5243,
    hostname: '104.199.30.184',
    method: 'POST',
    path: '/travis-build',
    headers: {
      'x-travis-ci-event': 'build-stage',
      'content-type': 'application/json'
    }
  };

  const payload = {
    'branch': process.env.TRAVIS_BRANCH || 'stage',
    'buildNumber': process.env.TRAVIS_BUILD_NUMBER || 'dev',
    'commit': process.env.TRAVIS_COMMIT || 'test',
    'jobNumber': process.env.TRAVIS_JOB_NUMBER || 'dev',
    'pullRequest': process.env.TRAVIS_PULL_REQUEST || false,
    'pullRequestSha': process.env.TRAVIS_PULL_REQUEST_SHA || 'none',
    'slug': process.env.TRAVIS_REPO_SLUG || 'unknown'
  };

  var req = http.request(options, (res) => {
    res.on('end', () => {
      process.exit();
    });
  });
  req.on('end', () => {
    process.exit();
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
    process.exit(1);
  });
  req.write(JSON.stringify(payload));
  req.end();
}
