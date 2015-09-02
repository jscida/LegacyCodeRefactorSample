var Promise = require('bluebird');
var LinkedList = require('./linkedList');
var webHelper = require('./webHelper');
var moment = require('moment');
var logging = require('../logging');
var io;
var config;

var onlineSocks = {};
var invHub = {}; 
var messageHub = new LinkedList();

var LOGGED_USERS_AMOUNT = 0;

module.exports.initialize = function(eio, configObj){
    io = eio;
    config = configObj;
};

module.exports.addLoggedUser = function(){
    LOGGED_USERS_AMOUNT ++;
    return LOGGED_USERS_AMOUNT;
};

module.exports.onPresence = function(socket, data, logger){
	
    return new Promise(function(resolve, reject){
		
        ... Some Business Logic ...

        return myAsyncFunction(userId, logger).then(function(){
            resolve();
        }, function(err){
            reject(err);
        });
    });
};
    
module.exports.onDisconnect = function(socket, data, logger){
    return new Promise(function(resolve, reject){

        if(LOGGED_USERS_AMOUNT > 0){
            LOGGED_USERS_AMOUNT --;
            logger.info('Current Connections: ' + LOGGED_USERS_AMOUNT);
        }
        else{
            logger.warn('Trying to remove socket: ' + socket.id + ' and Current Connections: ' + LOGGED_USERS_AMOUNT );
        }

        ... Some Business Logic ...
		
        resolve();
    });
};

module.exports.doSomeIntervalStuff = function(logger){
    return new Promise(function(resolve, reject){
        
		... Some Business Logic ...

        var data = JSON.stringify({ data: tmp });
        var options = {
            hostname: config.webSite.host,
            port: config.webSite.port,
            path: config.webSite.chatLogsHandler,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data)
            }
        };

        webHelper.makeHttpRequest(options, logger, data).then(function(res){
            resolve();
        }, function(err){
            reject(err);
        });
    });
};

function myAsyncFunction(userId, logger) {
    return new Promise(function(resolve, reject){

        var params = JSON.stringify({ id: userId });
        var options = {
            hostname: config.webSite.host,
            port: config.webSite.port,
            path: config.webSite.friendListHandler,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(params)
            }
        };

        webHelper.makeHttpRequest(options, logger, params).then(function(res){
            ... Some Business Logic ...
            resolve();
        },function(err){
            ... Some Custom error handling ...
            reject(err);
        });
    });
};