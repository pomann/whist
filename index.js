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
// 
// 

// 
// Server required variables
// 
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var express = require('express')

// 
// Custom variables
// 
var players = {};
var soc = {};
var games = {};
// 
// Custom Classes
// 

//player class for the game
class Player {
	constructor(id) {
		this.ID = id;
		this.playerName;
		this.hand;
		this.inLobby = "";
		this.playing = false;
	}
}

// Card class
class Card {
	constructor(value,suit) {
		this.value = value;
		this.suit = suit;
	} 
}


// Game class
class Game {
	constructor(players){
		//keeps track of the players in the game
		this.players = players;
		//keeps track of the current player
		this.cPlayer = 0;
		//keeps track of the trump card for the current round
		this.trumpC = ["H","D","S","C"];
		//keeps track of the score
		this.score;
		this.playedCards = {};
		this.shuffleDeck();
	}

	winningTrick(){
		//calculate which player won the current trick
	}

	shuffleDeck(){
		//Creates a deck of cards, shuffles the array of cards and every player is given 13 cards
		var deck = [];
		for(var i = 0; i < this.trumpC.length; i++){
			for(var j = 1; j < 14; j++){
				
				if(j == 1) deck.push(new Card("A",this.trumpC[i]));
				else if(j == 11) deck.push(new Card("J",this.trumpC[i]));
				else if(j == 12) deck.push(new Card("Q",this.trumpC[i]));
				else if(j == 13) deck.push(new Card("K",this.trumpC[i]));
				else deck.push(new Card(j,this.trumpC[i]));
			}
		}

		console.log(deck);

	    var j, x, i;
	    for (i = deck.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = deck[i];
	        deck[i] = deck[j];
	        deck[j] = x;
	    }
	    for(var i = 0; i<this.players.length;i++){
	    	var player_deck = deck.splice(0,13);
	    	players[soc[this.players[i]]].hand = player_deck;
	    	io.sockets.connected[this.players[i]].emit('player_hand', player_deck);
		}
	}

	startNewGame(){
		//starts a new game
	}

	newRound(){
		//starts a new round
	}
}


// Lobby class
class Lobby {
	constructor(lobbyName) {
		this.lobbyName = lobbyName;
		this.waitingPlayers = [];
		this.empty = false;
	}
	// Starts game if lobby is full 
	fullLobby() {
		//change this back to 4 when game is complete
		if (this.waitingPlayers.length == 4) {
			delete lobbies[this.lobbyName];
			this.start();
		}
	}
	// Adds player into waiting_players and calls fullobby()
	addPlayer(player) {
		this.waitingPlayers.push(player);
		this.fullLobby()
	}
	// If a player disconnects, deletes the player from waiting_players and updates info for clients, calls deleteLobby()
	deletePlayer(playerId) {
		this.waitingPlayers.splice(this.waitingPlayers.indexOf(playerId), 1);
		for (var name in players) {
			if (players[name].ID != playerId) {
				io.sockets.connected[players[name].ID].emit("lobby_count", [players[soc[playerId]].inLobby, -1]);
			}
		}
		this.deleteLobby(playerId);
	}
	// Sends info to clients saying game started and creates a new game object
	start() {
		for (var i = 0; i < this.waitingPlayers.length; i++) {
			console.log(soc[this.waitingPlayers[i]]);
			players[soc[this.waitingPlayers[i]]].playing = true;
			io.sockets.connected[this.waitingPlayers[i]].emit('start_game', true);
		}
		games[this.lobbyName] = new Game(this.waitingPlayers);
	}
	// Deletes lobby id lobby empty 
	deleteLobby(playerId) {
		//deletes the lobby if it's empty
		if (this.waitingPlayers.length == 0) {
			delete lobbies[this.lobbyName]
			for (var name in players) {
				if (players[name].ID != playerId) {
					io.sockets.connected[players[name].ID].emit("lobby_update", true);
					for (var key in lobbies) {
						io.sockets.connected[players[name].ID].emit("lobbies", [key, lobbies[key].waitingPlayers.length]);
					}
				}
			}
		}
	}
}


var lobbies = {
	"lobby1": new Lobby("lobby1")
};

// 
// Server handling requests coming in and sending responses
// 

//this will send the index.html file to the client when a GET request is sent to the server
//read this if you wanna know more about whats going on, it'll help if you have to debug later
//https://developer.mozilla.org/en-US/docs/Glossary/Callback_function 
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
	app.use(express.static(path.join(__dirname, 'public')));
});


//sets up a websocket connection with the client and some basic error handling for if a client 
//disconnects, it also assigns them a unique ID
io.on('connection', function (socket) {
	console.log('a user connected');
	console.log(socket.id);
	soc[socket.id] = "";
	// On disconnect we remove all player data, update lobbies count and finish any started games
	socket.on('disconnect', function () {
		if (soc[socket.id] != "") {
			if (players[soc[socket.id]].inLobby != "" && !players[soc[socket.id]].playing) {
				lobbies[players[soc[socket.id]].inLobby].deletePlayer(socket.id);
			}
			delete players[soc[socket.id]];
		}
		delete soc[socket.id];
		console.log(players);
	});


	//Sets the player info on set_username request  
	socket.on('set_username', function (username) {
		if (username in players) {
			socket.emit("accept_username", false);
		} else {
			soc[socket.id] = username;
			players[soc[socket.id]] = new Player(socket.id);
			players[soc[socket.id]].playerName = username;
			console.log(username);
			socket.emit("accept_username", true);
			for (var key in lobbies) {
				socket.emit("lobbies", [key, lobbies[key].waitingPlayers.length]);
			}
		}
		console.log(players);
	});

	//Creates lobby entry and joins the player on create_lobby request
	socket.on("create_lobby", function (lobbyName) {
		if (lobbyName in lobbies) {
			socket.emit("accept_lobby", false);
		} else {
			lobbies[lobbyName] = new Lobby(lobbyName);
			lobbies[lobbyName].addPlayer(socket.id);
			players[soc[socket.id]].inLobby = lobbyName;
			socket.emit('accept_lobby', true);
			for (var name in players) {
				if (players[name].playerName != "") {
					io.sockets.connected[players[name].ID].emit("lobbies", [lobbyName, 1]);
				}
			}
		}
	});

	//Joins the player into a lobby on join_lobby request
	socket.on("join_lobby", function (lobbyName) {
		if (lobbyName in lobbies) {
			players[soc[socket.id]].inLobby = lobbyName;
			socket.emit("joined_lobby", true);
			lobbies[lobbyName].addPlayer(socket.id);
			for (var name in players) {
				if (players[name].playerName != "") {
					io.sockets.connected[players[name].ID].emit("lobby_count", [lobbyName, 1]);
				}
			}
		} else {
			socket.emit("joined_lobby", false);
		}
	});

	socket.on("played_card", function(arr){
		if (games[players[soc[socket.id]].inLobby].players[games[players[soc[socket.id]].inLobby].cPlayer] != socket.id) {
			console.log("not your turn")
			socket.emit("played_card",false);
			return;
		}
		games[players[soc[socket.id]].inLobby].playedCards[socket.id] = arr[1]
		// socket.emit("played_card",arr[0]);
		for(var i = 0; i < games[players[soc[socket.id]].inLobby].players.length; i++){
			if (games[players[soc[socket.id]].inLobby].players[i] == socket.id) {
				socket.emit("played_card",[arr[0],0]);
			}else{
				var count = 1
				for (var j = i + 1; count < 3; j++) {
					if(j == games[players[soc[socket.id]].inLobby].players.length) j = 0;
					if (games[players[soc[socket.id]].inLobby].players[j] == socket.id) break;
					count ++;
				}
				io.sockets.connected[games[players[soc[socket.id]].inLobby].players[i]].emit("played_card",[arr[0],count])

			}
		}
		games[players[soc[socket.id]].inLobby].cPlayer ++;
		if (games[players[soc[socket.id]].inLobby].cPlayer > 3) {
			// caclulate winning trick, 
			games[players[soc[socket.id]].inLobby].cPlayer = 0
		}
	})
});
//set the server to listen on the port 3000
http.listen(3000, function () {
	console.log('listening on *:3000');
});