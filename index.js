
'use strict';

module.exports = function(webSocket){

  var send,
      callbacks = {};

  webSocket.on('message', function(data) {

    var response;

    try {
      response = JSON.parse(data);
    } catch(parseError){
      throw parseError;
    }

    if(typeof callbacks[response.id] === 'function'){
      callbacks[response.id](response);
      delete callbacks[response.id];
    }
  });

  send = function(message){

    return new Promise(function(res){
      message.id = `${process.hrtime()[0]}${process.hrtime()[1]}`;
      callbacks[message.id] = res;
      webSocket.send(JSON.stringify(message));
    });
  };

  return {
    send: send
  };
};
