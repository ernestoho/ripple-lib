'use strict';
const _ = require('lodash');
const async = require('async');
const utils = require('./utils');
const getTrustlines = require('./trustlines');
const validate = utils.common.validate;
const composeAsync = utils.common.composeAsync;
const dropsToXrp = utils.common.dropsToXrp;

function getXRPBalance(remote, address, ledgerVersion, callback) {
  remote.requestAccountInfo({account: address, ledger: ledgerVersion},
    composeAsync((data) => dropsToXrp(data.account_data.Balance), callback));
}

function getTrustlineBalanceAmount(trustline) {
  return {
    currency: trustline.specification.currency,
    counterparty: trustline.specification.counterparty,
    value: trustline.state.balance
  };
}

function formatBalances(balances) {
  const xrpBalance = {
    currency: 'XRP',
    value: balances[0]
  };
  return [xrpBalance].concat(balances[1].map(getTrustlineBalanceAmount));
}

function getBalances(account, options, callback) {
  validate.address(account);
  validate.options(options);

  const ledgerVersion = options.ledgerVersion
                      || this.remote.getLedgerSequence();
  async.parallel([
    _.partial(getXRPBalance, this.remote, account, ledgerVersion),
    _.partial(getTrustlines.bind(this), account, options)
  ], composeAsync(formatBalances, callback));
}

module.exports = utils.wrapCatch(getBalances);
