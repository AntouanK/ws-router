
'use strict';


module.exports = function(webSocket){

  var send,
      callbacks = {};

  //   atach listener on webSocket
  webSocket.on('message', function(responseString) {

    var response;

    try {
      //  parse the response JSON string
      response = JSON.parse(responseString);
    } catch(parseError){
      throw parseError;
    }

    //  check it's id, and see if we have a callback registered with that id...
    if(typeof callbacks[response.id] === 'function'){
      //  if found, call it with the reponse
      callbacks[response.id](response);
      //  delete that callback from our map
      delete callbacks[response.id];
    }
  });


  //  make a send function for that webSocket connection
  send = function(message){

    return new Promise(function(res){
      //  create an id based on current time
      message.id = `${Date.now()}${process.hrtime()[0]}${process.hrtime()[1]}`;
      //  add that callback to our map
      callbacks[message.id] = res;
      //  send the message after stringifying
      webSocket.send(JSON.stringify(message));
    });
  };

  //  expose
  return {
    send: send
  };
};
