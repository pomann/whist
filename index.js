//
//
//
//   _____   ____  _   _ _ _______   _______ ____  _    _  _____ _    _   _______ _    _ _____  _____   ______ _____ _      ______ 
//  |  __ \ / __ \| \ | ( )__   __| |__   __/ __ \| |  | |/ ____| |  | | |__   __| |  | |_   _|/ ____| |  ____|_   _| |    |  ____|
//  | |  | | |  | |  \| |/   | |       | | | |  | | |  | | |    | |__| |    | |  | |__| | | | | (___   | |__    | | | |    | |__   
//  | |  | | |  | | . ` |    | |       | | | |  | | |  | | |    |  __  |    | |  |  __  | | |  \___ \  |  __|   | | | |    |  __|  
//  | |__| | |__| | |\  |    | |       | | | |__| | |__| | |____| |  | |    | |  | |  | |_| |_ ____) | | |     _| |_| |____| |____ 
//  |_____/ \____/|_| \_|    |_|       |_|  \____/ \____/ \_____|_|  |_|    |_|  |_|  |_|_____|_____/  |_|    |_____|______|______|
//
//
//
//
//
//
//
//
//










//these are basically the modules we need to input the app, think of them as imports from python
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var soc = {};
var lobbies = {};
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

class Lobby {
	constructor(){
	    this.lobbyName;
		this.waitingPlayers = [];
		this.empty = false;
	}

	fullLobby(){
		if(this.waitingPlayers.length == 4){
		    delete lobbies[this.lobbyName];
		    this.start();
		}
	}
	
	addPlayer(player){
	    this.waitingPlayers.push(player);
	}

	start(){
		//starts the game once the lobby is full
	}

	deleteLobby(){
		//deletes the lobby if it's empty
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
	
	socket.on("create_lobby", function(lobbyName) {
	    if(lobbyName in lobbies){
	        socket.emit("accept_lobby", false);
	    }else{
	        lobbies[lobbyName] = new Lobby();
	        lobbies[lobbyName].addPlayer(socket.id);
	        socket.emit('accept_lobby', true);
	    }
	});
	
	socket.on("join_lobby", function(lobbyName) {
	    if(lobbyName in lobbies){
	        lobbies[lobbyName].addPlayer(socket.id);
	        lobbies[lobbyName].fullLobby();
	        socket.emit("joined_lobby", true);
	    }else{
	        socket.emit("joined_lobby", false);
	    }
	});
});
//set the server to listen on the port 3000
http.listen(3000, function(){
    console.log('listening on *:3000');
});