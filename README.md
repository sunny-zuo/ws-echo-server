# WebSocket Echo Server

This is a simple WebSocket echo server written in Node.js. When the server receives a message, that message is sent to all connected clients. 

This was originally designed as a server reference for simple multiplayer games for a Flash game development summer camp at the University of Calgary and was intended to be hosted on Heroku's free tier.

## Configuration
- The server utilizes the `PORT` environment variable as the port, and defaults to 8080.

## Running the Server
```
node run start
```