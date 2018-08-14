'use strict'; // enables strict mode that will throw more exceptions for errors

const express = require('express'); // imports a web framework for nodejs
const WebSocket = require('ws'); // imports the websocket framework
const SocketServer = require('ws').Server; // imports the websocket server framework
const path = require('path'); // framework to access local files. not used right now.

const PORT = process.env.PORT || 3000;
/*
Picks the port that the server will run on.
process.env.PORT is a runtime variable that can be set on Heroku.
However, when deploying on Heroku, the port seems to be ignored.
*/

const mainServer = express()
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
// creates the server and logs the port it's running on

const wss = new SocketServer({ mainServer });
// creates the websocket server

wss.on('connection', (ws) => { // when the socket server has a connection, this function is ran. ws represents the client.
  console.log('Client connected');
  ws.on('message', function incoming(data) { // once the client sends a message, this function is ran
    if (data == '<policy-file-request/>\0') {
      console.log("policy request");
    }
	  wss.clients.forEach(function each(client) { // finds all of the connected clients, and tries to send the message to all of them
      if (client.readyState === WebSocket.OPEN) { // if the client is ready to receive messages, send them the message we just received.
        client.send(data);
      }
	  });
  });
  ws.on('close', () => console.log('Client disconnected')); // once the client leaves, this function is ran. all that is done right now is to log that they have disconnected.
});


/* the code below has the server essentially ping itself.
herokuapp puts apps to sleep after 30 minutes of inactivity,
and will reboot once a request is received. This takes time, usually around 20 seconds-ish.
20 second downtime is unacceptable for someone wanting to play, so thus this keepawake function is ran.*/
const http = require("http");
setInterval(function() {
    http.get("http://battle-bane.herokuapp.com");
}, 300000); // every 5 minutes (300000) 

///

var net = require('net');

var server = net.createServer(handler);
var port = process.env.PORT ||  843;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

function handler (socket) {
     socket.setEncoding("utf8");
 
     socket.write(xmlPolicy() + '\0');
 
     function policy_check(data) {
          socket.removeListener('data', policy_check); 
          try {
               if(data == '<policy-file-request/>\0') {
                    socket.write(xmlPolicy());
					socket.end();
               }
          } catch (ex) {
               console.log(ex);
          }
     }
 
     socket.on('data', policy_check);
 
     socket.on("error", function (exception) {
          socket.end();
     });
     socket.on("timeout", function () {
          socket.end();
     });
     socket.on("close", function (had_error) {
          socket.end();
     });
}
 
function xmlPolicy() {
     var policy = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM'
     policy += ' "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">';
     policy += '\n<cross-domain-policy>\n';
     policy += '<allow-access-from domain="*" to-ports="*"/>\n';
     policy += '</cross-domain-policy>\n';
     return policy;
}