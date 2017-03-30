'use strict';

module.exports = function (client) {

  var _ = require('lodash');
  var inherits = require('inherits');
  var Promise = require('../node_modules/knex/lib/promise');

  var SqlString = require('../node_modules/knex/lib/dialects/mysql/string');
  var Runner = require('../node_modules/knex/lib/runner');

  // Inherit from the `Runner` constructor's prototype,
  // so we can add the correct `then` method.
  function Runner_FILEMAKER_ODBC() {
    this.client = client;
    Runner.apply(this, arguments);
  }
  inherits(Runner_FILEMAKER_ODBC, Runner);

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.
  Runner_FILEMAKER_ODBC.prototype._query = Promise.method(function (obj) {
    var connection = this.connection;
    var sql = obj.sql;
    if (this.isDebugging()) this.debug(obj);
    if (obj.options) sql = _.extend({ text: sql }, obj.options);
    return new Promise(function (resolver, rejecter) {
      connection.query(SqlString.format(sql, obj.bindings), function (err, response) {
        if (err) return rejecter(err);
        obj.response = response;
        resolver(obj);
      });
    });
  });

  // Ensures the response is returned in the same format as other clients.
  Runner_FILEMAKER_ODBC.prototype.processResponse = function (obj) {
    var resp = obj.response; //resp should be blank for updates/inserts

    if (obj.output) return obj.output.call(this, resp); //does not exist for updates/inserts
    if (obj.method === 'raw') return resp;
    var returning = obj.returning;
    if (resp.command === 'select') {
      if (obj.method === 'first') return resp.rows[0];
      if (obj.method === 'pluck') return _.pluck(resp.rows, obj.pluck);
      return resp.rows;
    } else if (obj.method === "insert") {}
    console.dir(obj);
    this.connection.query('select RowID from "AC__Account" where ', function (err, response) {
      console.dir(response);
    });
    if (returning && false) {
      var returns = [];
      for (var i = 0, l = resp.rows.length; i < l; i++) {
        var row = resp.rows[i];
        if (returning === '*' || _.isArray(returning)) {
          returns[i] = row;
        } else {
          returns[i] = row[returning];
        }
      }
      return returns;
    }
    if (resp.command === 'update' || resp.command === 'delete') {
      return resp.rowCount;
    }
    return resp;
  };

  // Assign the newly extended `Runner` constructor to the client object.
  client.Runner = Runner_FILEMAKER_ODBC;
};