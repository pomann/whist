//these are basically the modules we need to input the app, think of them as imports from python
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var soc = {};
var path = require('path')
var express = require('express')

//player class for the game
class Player {
	constructor(id){
		this.id = id;
		this.playerName;
		this.hand;
	}
}

//this will send the index.html file to the client when a GET request is sent to the server
//read this if you wanna know more about whats going on, it'll help if you have to debug later
//https://developer.mozilla.org/en-US/docs/Glossary/Callback_function 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});


//sets up a websocket connection with the client and some basic error handling for if a client 
//disconnects, it also assigns them a unique ID
io.on('connection', function(socket){
    console.log('a user connected');
    console.log(socket.id);
    soc[socket.id] = "";
    socket.on('disconnect', function(){
        if(soc[socket.id] != ""){
        	delete players[soc[socket.id]];
        }
        delete soc[socket.id];
        console.log(players);
    });
    
	
	//sets the player username 
    socket.on('set_username', function(username){
    	if(username in players){
    		socket.emit("accept_username",false);
    	}else{
    		soc[socket.id] = username;
    		players[soc[socket.id]] = new Player(socket.id);
    		players[soc[socket.id]].playerName = username;
        	console.log(username);
        	socket.emit("accept_username",true);
    	}
    	console.log(players);
    });
    
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit("msg", msg);
	});
});
//set the server to listen on the port 3000
http.listen(3000, function(){
    console.log('listening on *:3000');
});