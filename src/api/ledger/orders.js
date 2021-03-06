'use strict';
const _ = require('lodash');
const utils = require('./utils');
const validate = utils.common.validate;
const composeAsync = utils.common.composeAsync;
const parseAccountOrder = require('./parse/account-order');

function requestAccountOffers(remote, address, ledgerVersion, options,
    marker, limit, callback) {
  remote.requestAccountOffers({
    account: address,
    marker: marker,
    limit: limit,
    ledger: ledgerVersion
  },
  composeAsync((data) => ({
    marker: data.marker,
    results: data.offers.map(parseAccountOrder)
  }), callback));
}

function getAccountOrders(account, options, callback) {
  validate.address(account);
  validate.options(options);

  const defaultLimit = 100;
  const limit = options.limit || defaultLimit;
  const ledgerVersion = options.ledgerVersion
                      || this.remote.getLedgerSequence();
  const getter = _.partial(requestAccountOffers, this.remote, account,
                           ledgerVersion, options);
  utils.getRecursive(getter, limit,
    composeAsync((orders) => _.sortBy(orders,
      (order) => order.properties.sequence), callback));
}

module.exports = utils.wrapCatch(getAccountOrders);
