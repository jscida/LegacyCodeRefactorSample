var log4js = require('log4js');

var logger = null;
var isInitialized = false;

var Logger = function(contextid, params) {
  this.params = params;
  this.contextid = contextid;
};

Logger.prototype.format = function(message) {
  var line = '';
  if (this.contextid) {
    line = this.contextid + " - ";
  }

  line = line + message;
  if (!this.params) {
    return line;
  }
  line = line + '\n';
  for (var key in this.params) {
    line = line + key + ': ' + this.params[key] + " - ";
  }

  return line;
};

Logger.prototype.trace = function(message) {
  logger.trace(this.format(message));
};

Logger.prototype.debug = function(message) {
  logger.debug(this.format(message));
};

Logger.prototype.info = function(message) {
  logger.info(this.format(message));
};

Logger.prototype.warn = function(message) {
  logger.warn(this.format(message));
};

Logger.prototype.error = function(message) {
  logger.error(this.format(message));
};

Logger.prototype.fatal = function(message) {
  logger.fatal(this.format(message));
};

module.exports.getLog4jsLogger = function() {
  if (!isInitialized) {
    throw new Error('Logger not initialized')
  }
  return logger;
};

module.exports.createLogger = function(contextid, params) {
  return new Logger(contextid, params);
};

module.exports.initializeMaster = function(config) {
  log4js.clearAppenders();
  log4js.configure({
    appenders: [
      {
        type: "clustered",
        appenders: config.appenders
      }
    ]
  });

  logger = log4js.getLogger('master');
  if (!config.level) {
    config.level = 'DEBUG';
  }
  logger.setLevel(config.level);
  isInitialized = true;
};

module.exports.initializeWorker = function(workerId, logLevel) {
  log4js.clearAppenders();
  log4js.configure({
    appenders: [
      {
        type: "clustered"
      }
    ]
  });

  logger = log4js.getLogger("worker_" + workerId);
  if (!logLevel) {
    logLevel = 'DEBUG';
  }
  logger.setLevel(logLevel);
  isInitialized = true;
};

module.exports.initialize = function(config) {
  log4js.clearAppenders();
  log4js.configure({
      appenders: config.appenders
  });
  logger = log4js.getLogger();
  logger.setLevel(config.level);
  isInitialized = true;
};

