'use strict';

module.exports = function(client) {

var Seeder = require('../node_modules/knex/lib/seed');
var inherits = require('inherits');

// Inherit from the `Seeder` constructor's prototype,
// so we can add the correct `then` method.
function Seeder_FILEMAKER_ODBC() {
  this.client = client;
  Seeder.apply(this, arguments);
}
inherits(Seeder_FILEMAKER_ODBC, Seeder);

// Assign the newly extended `Seeder` constructor to the client object.
client.Seeder = Seeder_FILEMAKER_ODBC;

};
