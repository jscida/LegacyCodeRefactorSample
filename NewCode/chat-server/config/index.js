var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var config = null;
var DEV_ENVS = [ 'staging' ];

/**
 * The configuration object for parsing configuration file.
 * 
 * @constructor
 */
var Configuration = function() {
  this.isInitialized = false;
  this.configFile = null;
};

/**
 * Initialize the Configuration.
 * 
 * @param {boolean}
 *            reload If the configuration should be reloaded.
 */
Configuration.prototype.initialize = function(reload) {
  if (this.isInitialized && !reload) {
    return;
  }

  this.configFile = require(path.join(__dirname, this.getEnv()));

  if (fs.existsSync(path.join(__dirname, 'passwords.json'))) {
    var protected = require(path.join(__dirname, 'passwords'));
    this.configFile = _.merge(this.configFile, protected);
  }

  this.isInitialized = true;
};

/**
 * Get the current configuration object.
 * 
 * @return {!Object} The parsed configuration file.
 */
Configuration.prototype.getCurrent = function() {
  if (!this.isInitialized) {
    this.initialize();
  }
  return this.configFile;
};

/**
 * Get the current running environment.
 * 
 * @return {!string} The running environment.
 */
Configuration.prototype.getEnv = function() {
  if(!process.env.NODE_ENV){
    return 'staging';
  }
  return process.env.NODE_ENV;
};

/**
 * Check if the running environment is a dev environment.
 * 
 * @return {!bool} If the running environment is development.
 */
Configuration.prototype.isDevEnv = function() {
  var env = this.getEnv();
  return DEV_ENVS.indexOf(env) == 0;
};

module.exports = (function() {
  if (!config) {
    config = new Configuration();
  }
  return config;
})();