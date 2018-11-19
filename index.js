var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var soc = {};
var path = require('path')
var express = require('express')

class Player {
	constructor(id){
		this.id = id;
		this.playerName;
		this.hand;
	}
}


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});

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

http.listen(3000, function(){
    console.log('listening on *:3000');
});