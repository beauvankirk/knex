'use strict';

// FileMaker JDBC Column Builder & Compiler
// -------

module.exports = function (client) {

  var inherits = require('inherits');
  var Schema = require('../../../schema');

  // Column Builder
  // ------

  function ColumnBuilder_FILEMAKER_ODBC() {
    this.client = client;
    Schema.ColumnBuilder.apply(this, arguments);
  }
  inherits(ColumnBuilder_FILEMAKER_ODBC, Schema.ColumnBuilder);

  function ColumnCompiler_FILEMAKER_ODBC() {
    this.modifiers = ['nullable', 'defaultTo', 'comment'];
    this.Formatter = client.Formatter;
    Schema.ColumnCompiler.apply(this, arguments);
  }
  inherits(ColumnCompiler_FILEMAKER_ODBC, Schema.ColumnCompiler);

  // Types
  // ------
  ColumnCompiler_FILEMAKER_ODBC.prototype.bigincrements = 'INT PRIMARY KEY';
  ColumnCompiler_FILEMAKER_ODBC.prototype.bigint = 'INT';
  ColumnCompiler_FILEMAKER_ODBC.prototype.binary = 'BLOB';
  ColumnCompiler_FILEMAKER_ODBC.prototype.bit = 'BIT';
  ColumnCompiler_FILEMAKER_ODBC.prototype.bool = 'BOOLEAN';

  // Create the column definition for an enum type.
  // Using method "2" here: http://stackoverflow.com/a/10984951/525714
  ColumnCompiler_FILEMAKER_ODBC.prototype.enu = function (allowed) {
    return 'text check (' + this.formatter.wrap(this.args[0]) + " in ('" + allowed.join("', '") + "'))";
  };

  ColumnCompiler_FILEMAKER_ODBC.prototype.double = 'DOUBLE';
  ColumnCompiler_FILEMAKER_ODBC.prototype.floating = 'FLOAT';
  ColumnCompiler_FILEMAKER_ODBC.prototype.increments = 'INT PRIMARY KEY';
  ColumnCompiler_FILEMAKER_ODBC.prototype.json = 'VARCHAR (500276)';
  ColumnCompiler_FILEMAKER_ODBC.prototype.smallint = 'INT';
  ColumnCompiler_FILEMAKER_ODBC.prototype.tinyint = 'SMALLINT';
  ColumnCompiler_FILEMAKER_ODBC.prototype.datetime = '';
  ColumnCompiler_FILEMAKER_ODBC.prototype.timestamp = 'TIMESTAMP';
  ColumnCompiler_FILEMAKER_ODBC.prototype.uuid = 'CHAR(36)';

  // Modifiers:
  // ------
  ColumnCompiler_FILEMAKER_ODBC.prototype.comment = ' --' + comment;

  client.ColumnBuilder = ColumnBuilder_FILEMAKER_ODBC;
  client.ColumnCompiler = ColumnCompiler_FILEMAKER_ODBC;
};