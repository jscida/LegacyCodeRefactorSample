var logging = require('../logging');
var eventManager = require('./eventManager');
var logger = logging.createLogger('IoW');
var io;
var ioW;

var IoW = function(){
    this.initialized = false;
};

IoW.prototype.initialize = function(config){
    if(this.initialized){
        return;
    }
    var obj = config.getCurrent();
    if(!obj || !obj.app){
        logger.error('Invalid configuration, check config folder for correct .json config file');
        return;
    }
    if(!obj.app.port) {
        obj.app.port = 8000;
    }
    io = require('socket.io')(obj.app.port);
    logger.info('Chat Server started in ' + config.getEnv() + ' at port ' + obj.app.port);
    io.on('connection', onIoConnection);
    eventManager.initialize(io, obj);
    setInterval(function(){
        eventManager.doSomeIntervalStuff(logger).then(null,function(err){
            logger.error('doSomeIntervalStuff - ' + err.stack);
        });
    }, obj.app.chatLogInterval);

    this.initialized = true;
};

function onIoConnection(socket){
    var sLogger = logging.createLogger(socket.id + ' - ' + 'connection');
    var loggedUsers = eventManager.addLoggedUser();
    sLogger.info('Current Connections: ' + loggedUsers);
    registerOnceEvent(socket, 'disconnect', eventManager.onDisconnect);
    registerOnEvent(socket, 'presence', eventManager.onPresence);
};

function registerOnceEvent(socket, eventName, eventHandler){
    socket.once(eventName, function(data){
        execEventHandler(socket,eventName,eventHandler,data);
    });
};

function registerOnEvent(socket, eventName, eventHandler){
    socket.on(eventName, function(data){
        execEventHandler(socket,eventName,eventHandler,data);
    });
};

function execEventHandler(socket, eventName, eventHandler, data){
    var sLogger = logging.createLogger(socket.id + ' - ' + eventName);
    sLogger.info('');
    eventHandler(socket, data, sLogger).then(null, function(err){
        sLogger.error(err.stack);
    });
};

module.exports = function(){
    if(!ioW){
        ioW = new IoW();
    }
    return ioW;
}();




