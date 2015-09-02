var io = require('socket.io')(8880);
var http = require('http');
var fs = require('fs');
var moment = require('moment');

////// video part
/*
var server = http.createServer().listen(8881);
var rtc = holla.createServer(server, { debug: true, presence: true });*/

////// conf section
/*io.enable('browser client minification');
io.configure(function () { // show only error messages
    io.set('log level', 1);
});*/

// variables
var INV_TIMEOUT = 5 * 60 * 1000; // invitation timeout
var INV_REPEAT_INTERVAL = 1000; // invitation repeat interval
var CHAT_LOGS_INTERVAL = 60 * 1000; // chat logs interval
var HOSTNAME = "mysite.com"; // web-side host name
var PORT = 80; // web-side host port
var CHAT_AUTH_HANDLER = "/handlers/ExternalHandler.ashx"; 
var CHAT_LOGS_HANDLER = "/MyMethods.aspx/SaveLogs"; 
var FRIEND_LIST_HANDLER = "/MyMethods.aspx/FriendsList"; 
var USER_CAN_CHAT_HANDLER = "/MyMethods.aspx/UserCanChat"; 

var onlineSocks = {};
var invHub = {}; 
var messageHub = new LinkedList();

io.on('connection', function (socket) {
    socket.on('presence', function (data) {
        try {
			... Some Business Logic ...
            myAsyncFunction(userId); 
        } catch (e) {
            log('ERROR: at presence, userId: ' + userId + ' +ex: ' + e);
        }
    });
	... Several events handlers ....	
    socket.once('disconnect', function () {
        try {
            var userId = onlineSocks[socket.id];
			log('INFO: at disconnect, userId: ' + userId);	
            ... Some Business Logic ....
        } catch (e) {
            log('ERROR: at disconnect + ex: ' + e);
        }
    });

    setInterval(function() {
        try {
            var date = Date.now();
            var tmp = [];
            while (0 < messageHub.count() && messageHub.head().date < date) {
                var item = messageHub.remove();
                tmp.push(item);
            }

            var data = JSON.stringify({ data: tmp });
            var request = http.request({
	            hostname: HOSTNAME,
	            port: PORT,
	            path: CHAT_LOGS_HANDLER,
	            method: 'POST',
	            headers: {
		            "Content-Type": "application/json",
		            "Content-Length": data.length
	            }
            });
            request.end(data);

            request.on('response', function (response) {
                if (response.statusCode != 200) {
                    log('ERROR: an error statusCode: ' + response.statusCode);
                }
	            response.on('data', function (chunk) {
                    var res = JSON.parse(chunk);
                    if (!res || !res.d)
                        log('WARNING: a warning');
	            });
            });

            request.on('error', function (e) {
                log('ERROR: an error + ' + e);
            });
            tmp = null;
        } catch (e) {
            log('ERROR:  ex: ' + e);
        }
    }, CHAT_LOGS_INTERVAL);
});

function log(msg) {
    msg = msg || '';
    if (msg.indexOf("ERROR:") != -1 || msg.indexOf("WARNING:") != -1 || msg.indexOf("INFO:") != -1)
        msg = '[' + new Date() + '] ' + msg;
    console.log(msg);
	var file = msg.indexOf("INFO:") != -1 ? LOG_FILE_INFO : LOG_FILE
    fs.appendFile(file, msg + '\n');
}

function myAsyncFunction(userId) {
	var params = JSON.stringify({ uid: userId });
	var request = http.request({
	    hostname: HOSTNAME,
	    port: PORT,
	    path: USER_CAN_CHAT_HANDLER,
	    method: 'POST',
	    headers: {
	        "Content-Type": "application/json",
		    "Content-Length": params.length
	    }
    });
	request.end(params);
	request.on('response', function (response) {
		if (response.statusCode != 200) {
            log('ERROR: an error + statusCode: ' + response.statusCode);
        }
        var buf = '';
		response.on('data', function (chunk) {
            buf += chunk;
	    });

        response.on('end', function(){
            try {
                var data = JSON.parse(buf);
                var d = JSON.parse(data.d);
                if (!res || !res.d)
                    log('WARNING: some warning');
				
            } catch (e){
                log(e.message);
            }
        });

        response.on('error', function(err){
            log(err.message);
        });
	});
}


