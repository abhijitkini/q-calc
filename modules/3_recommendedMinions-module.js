'use strict';

module.exports = function recommendedMinions(probAcceptable5MinWait,
  probAcceptable30MinWait, priorResults, results) {
  // For reference:
  // first row of probTimes contains headers for the queue wait time in minutes
  // the subsequent rows contain the number of concurrent minions available followed
  // by the probability of a build waiting for the designated wait time, e.g.
  // .26 corresponding to the 5 column means a 26% probability a build will wait
  // in the queue for at least 5 minutes before starting to process.

  const max5 = probAcceptable5MinWait;
  const max30 = probAcceptable30MinWait;
  const probTimes = priorResults[0];
  const queueStats = priorResults[1];
  const position5 = probTimes[0].indexOf(5); //array position of 5 min wait times
  const position30 = probTimes[0].indexOf(30); //array position of 30 min wait times

  for (let j=1; j<=probTimes.length - 1; j++) {
    let numBuildMinions = probTimes[j][0];
    let prob5 = probTimes[j][position5];
    let prob30 = probTimes[j][position30];
    if( prob5 <= max5 && prob30 <= max30) {
      let recommendedMinionCount = numBuildMinions;
      return results(null, [recommendedMinionCount, probTimes, queueStats]);
    }
  }
};
