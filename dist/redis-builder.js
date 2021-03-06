(function() {
  var betturl, build, err, loadModule, path, redis;

  path = require('path');

  betturl = require('betturl');

  loadModule = function(name, lookInPath) {
    var err;
    if (lookInPath == null) {
      lookInPath = process.cwd();
    }
    try {
      return require(path.join(lookInPath, 'node_modules', name));
    } catch (_error) {
      err = _error;
      if (lookInPath === path.sep) {
        throw err;
      }
      return loadModule(name, path.join(lookInPath, '../'));
    }
  };

  try {
    redis = loadModule('redis');
  } catch (_error) {
    err = _error;
    console.log('\nYou must npm install redis in order to use redis-builder\n');
    throw err;
  }

  build = function(config) {
    var client, database, host, password, port, url_config, _ref;
    if (config == null) {
      config = {};
    }
    if (config.client != null) {
      return config.client;
    }
    if (config.url != null) {
      url_config = betturl.parse(config.url);
    }
    host = (url_config != null ? url_config.host : void 0) || config.host || 'localhost';
    port = (url_config != null ? url_config.port : void 0) || config.port || 6379;
    database = (url_config != null ? url_config.path.slice(1) : void 0) || config.database;
    password = (url_config != null ? (_ref = url_config.auth) != null ? _ref.password : void 0 : void 0) || config.password;
    client = redis.createClient(port, host, config.options);
    if (password != null) {
      client.auth(password);
    }
    if (database != null) {
      if (parseInt(database).toString() !== database.toString()) {
        throw new Error('Database must be an integer');
      }
      client.select(parseInt(database));
    }
    return client;
  };

  module.exports = build;

}).call(this);
