'use strict';

// FileMaker JDBC
// -------
var _        = require('lodash');
var inherits = require('inherits');

var Client  = require('../node_modules/knex/lib/client');
var Promise = require('../node_modules/knex/lib/promise');

var odbc;

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
function Client_FILEMAKER_ODBC(config) {
  Client.apply(this, arguments);
  if (config.returning) this.defaultReturning = config.returning;
  if (config.debug) this.isDebugging = true;
  if (config.connection) {
    this.initDriver();
    this.initRunner();
    this.connectionSettings = config.connection;
    this.initPool();
    this.pool = new this.Pool(config.pool);
  }
}
inherits(Client_FILEMAKER_ODBC, Client);

Client_FILEMAKER_ODBC.prototype.dialect = 'filemaker-odbc';

// Lazy load the pg dependency, since we might just be using
// the client to generate SQL strings.
Client_FILEMAKER_ODBC.prototype.initDriver = function() {
  odbc = odbc || require("odbc").Database;
};

// Attach a `Formatter` constructor to the client object.
Client_FILEMAKER_ODBC.prototype.initFormatter = function() {
  require('./formatter')(this);
};

// Attaches the `Raw` constructor to the client object.
Client_FILEMAKER_ODBC.prototype.initRaw = function() {
  require('./raw')(this);
};

// Attaches the `FunctionHelper` constructor to the client object.
Client_FILEMAKER_ODBC.prototype.initFunctionHelper = function() {
  require('./functionhelper')(this);
};

// Attaches the `Transaction` constructor to the client object.
Client_FILEMAKER_ODBC.prototype.initTransaction = function() {
  require('./transaction')(this);
};

// Attaches `QueryBuilder` and `QueryCompiler` constructors
// to the client object.
Client_FILEMAKER_ODBC.prototype.initQuery = function() {
  require('./query')(this);
};

// Initializes a new pool instance for the current client.
Client_FILEMAKER_ODBC.prototype.initPool = function() {
  require('./pool')(this);
};

// Initialize the query "runner"
Client_FILEMAKER_ODBC.prototype.initRunner = function() {
  require('./runner')(this);
};

// Lazy-load the schema dependencies; we may not need to use them.
Client_FILEMAKER_ODBC.prototype.initSchema = function() {
  require('./schema')(this);
};

// Lazy-load the migration dependency
Client_FILEMAKER_ODBC.prototype.initMigrator = function() {
  require('./migrator')(this);
};

// Lazy-load the seeding dependency
Client_FILEMAKER_ODBC.prototype.initSeeder = function() {
  require('./seeder')(this);
};

// Get a raw connection, called by the `pool` whenever a new
// connection needs to be added to the pool.
Client_FILEMAKER_ODBC.prototype.acquireRawConnection = Promise.method(function(callback) {
 /*jshint unused: false*/
  // TODO: use callback or remove callback
  var client = this;
  var connection = new odbc();

  return new Promise(function(resolver, rejecter) {
    connection.open("DRIVER={FileMaker\ ODBC};SERVER="+client.connectionSettings.host+";UID="+client.connectionSettings.user+";PWD="+client.connectionSettings.password+";DATABASE="+client.connectionSettings.database, function (err){
      if(err){
        console.log('error'+err);
      }
      if (err) return rejecter(err);
      resolver(connection);
    });
  });
});

// Used to explicitly close a connection, called internally by the pool
// when a connection times out or the pool is shutdown.
Client_FILEMAKER_ODBC.prototype.destroyRawConnection = function(connection) {
  connection.close();
};

module.exports = Client_FILEMAKER_ODBC;
