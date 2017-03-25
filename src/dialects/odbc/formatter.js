'use strict';

// FileMaker JDBC Formatter
// -------
module.exports = function(client) {

var Formatter = require('../node_modules/knex/lib/formatter');
var inherits  = require('inherits');

// The "formatter" is used to ensure all output is properly
// escaped & parameterized.
function Formatter_FILEMAKER_ODBC() {
  this.client = client;
  this.paramCount = 0;
  Formatter.apply(this, arguments);
}
inherits(Formatter_FILEMAKER_ODBC, Formatter);

Formatter_FILEMAKER_ODBC.prototype.operators = [
  '=', '<>', '>', '>=', '<', '<=',
  'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL', 'BETWEEN', 'IN', 'NOT IN', 'EXISTS', 'ANY', 'ALL'
];

// Wraps a value (column, tableName) with the correct ticks.
Formatter_FILEMAKER_ODBC.prototype.wrapValue = function(value) {
  if (value === '*') return value;
  var matched = value.match(/(.*?)(\[[0-9]\])/);
  if (matched) return this.wrapValue(matched[1]) + matched[2];
  return '"' + value + '"';
};

// Memoize the calls to "wrap" for a little extra perf.
var wrapperMemo = (function(){
  var memo = Object.create(null);
  return function(key) {
    if (memo[key] === void 0) {
      memo[key] = this._wrapString(key);
    }
    return memo[key];
  };
}());

Formatter_FILEMAKER_ODBC.prototype._wrap = wrapperMemo;

// Assign the formatter to the the client.
client.Formatter = Formatter_FILEMAKER_ODBC;

};
