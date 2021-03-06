/* @flow */
'use strict';
const parseAmount = require('./amount');

function parsePathfind(sourceAddress: string,
    destinationAmount: Object, pathfindResult: Object): Object {
  return pathfindResult.alternatives.map(function(alternative) {
    return {
      source: {
        address: sourceAddress,
        amount: parseAmount(alternative.source_amount)
      },
      destination: {
        address: pathfindResult.destination_account,
        amount: destinationAmount
      },
      paths: JSON.stringify(alternative.paths_computed),
      allowPartialPayment: false,
      noDirectRipple: false
    };
  });
}

module.exports = parsePathfind;
