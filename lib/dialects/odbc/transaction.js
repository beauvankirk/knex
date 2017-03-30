'use strict';

module.exports = function (client) {

  var inherits = require('inherits');
  var Transaction = require('../node_modules/knex/lib/transaction');

  function Transaction_FILEMAKER_ODBC() {
    this.client = client;
    Transaction.apply(this, arguments);
  }
  inherits(Transaction_FILEMAKER_ODBC, Transaction);

  client.Transaction = Transaction_FILEMAKER_ODBC;
};