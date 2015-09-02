var config = require('./config');
var logging = require('./logging');
var ioW = require('./ioW');

var obj = config.getCurrent();
logging.initialize(obj.logging);

ioW.initialize(config);


