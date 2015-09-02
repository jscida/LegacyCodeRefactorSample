var Promise = require('bluebird');
var http = require('http');

module.exports.makeHttpRequest = function(params,logger, sendData){
    return new Promise(function(resolve, reject){
        var request = http.request(params);
        if(sendData){
            request.end(sendData);
        }
        else{
            request.end();
        }

        request.on('response', function (response) {
            var data='';
            response.on('data', function (chunk) {
                data += chunk;

            });
            response.on('end', function(){
                if (response.statusCode != 200) {
                    logger.debug(sendData);
                    logger.debug(data);
                    reject(new Error('Request failed. Path ' + params.path + ' statusCode: ' + response.statusCode));
                    return;
                }
                var res;
                try{
                    res = JSON.parse(data);
                }catch(e){
                    logger.debug(sendData);
                    logger.debug(data);
                    reject(new Error('Request failed. Path ' + params.path + ' . Could not parse response.'));
                    return;
                }

                if (!res || !res.d || !res.d.IsValid){
                    logger.debug(sendData);
                    logger.debug(data);
                    reject(new Error('Request failed. Path ' + params.path + ' . Invalid return data.'));
                    return;
                }

                resolve(res);
            });
        });

        request.on('error', function (e) {
            logger.debug(sendData);
            reject(new Error('Request failed. Path ' + params.path + ' Stack:' + e.stack));
        });
    });
};
