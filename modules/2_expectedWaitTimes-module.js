'use strict';

const roundNum = require('./roundNum-module.js');
const printResults = require('./printResults.js');
const writeToFile = require('./writeToFile-module.js');
const recommendedMinions = require('./3_recommendedMinions-module.js');

module.exports = function expectedWaitTimes(lambda, mu, priorResults, results) {
  // For reference:
  // first row of queueStats contains headers
  // queueStats[0] = number of build minions
  // queueStats[1] = avgNumWaiting in queue
  // queueStast[2] = avgWaitDuration in queue
  // queueStats[3] = avgMinionUtilization

  const queueStats = priorResults;
  const resultsExpectedWaitAll = [];
  const minuteBuckets = ['Minions', 0.5, 5, 10, 15, 20, 25, 30, 45, 60];  // array of wait values in minutes to calc prob for
  resultsExpectedWaitAll.push(minuteBuckets);

  let k = queueStats.length;
  for (let j=1; j<=k-1; j++) {
    const resultsExpectedWaitNumMinions = [];
    let numBuildMinions = queueStats[j][0];
    let avgNumWaiting = queueStats[j][1];
    let avgWaitDuration = queueStats[j][2];
    let avgMinionUtilization = queueStats[j][3];

    resultsExpectedWaitNumMinions.push(roundNum(numBuildMinions, 2));

    for (let l=1; l<=minuteBuckets.length - 1; l++) {
      resultsExpectedWaitNumMinions.push(
        roundNum((1 - avgMinionUtilization)/avgMinionUtilization * avgNumWaiting *
        Math.exp((lambda - numBuildMinions * mu) * minuteBuckets[l] / 60), 2));
    }
    resultsExpectedWaitAll.push(resultsExpectedWaitNumMinions);
  }
  return results(null, [resultsExpectedWaitAll, queueStats]);
};
