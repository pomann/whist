//Get the player name from the input field and send it to the server
var socket = io.connect();
var playerName;

// 
// 
//  Communication from server here
// 
// 

//  Creation of lobby true/false
socket.on("accept_lobby", function(accepted){
	if(accepted){
		document.getElementById("lobby_set").style = "display:none";
		document.getElementById("lobby").style = "display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;";
	}else{
		// Stay in lobby selection because lobby name is taken
		document.getElementById("lobby_error").style = "display:block;";
		document.getElementById("lobby_error").innerHTML = "This Lobby Already Exists";
		setTimeout(function(){
			document.getElementById("lobby_error").style = "display:none;";
		}, 3200)
	}
});

// Lobby joined true/false
socket.on("joined_lobby", function(accepted){
	if(accepted){
		document.getElementById("lobby_set").style = "display:none";
		document.getElementById("lobby").style = "display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;";
	}else{
		// Stay in lobby selection and display error message
		document.getElementById("lobby_error").style = "display:block;";
		document.getElementById("lobby_error").innerHTML = "Unable To Join Lobby";
		setTimeout(function(){
			document.getElementById("lobby_error").style = "display:none;";
		}, 3200)
	}
});

socket.on("lobbies", function(lobby) {
	document.getElementById("lobbies").innerHTML += '<li>' + lobby[0] + ' <span id="'+ lobby[0] +'_count" style="float:right;">'+ lobby[1] +'/4</span></li>';
});

socket.on("lobby_update", function(lobby) {
	document.getElementById("lobbies").innerHTML = "";
});

socket.on("lobby_count",function(arr){
	console.log(arr);
	n = parseInt(document.getElementById(arr[0] + "_count").innerHTML[0]) + arr[1];
	document.getElementById(arr[0] + "_count").innerHTML = n + "/4";
});

// Server response to set username
socket.on("accept_username", function(accepted){
	// If accepted show lobby screen, hide name selection
	if(accepted){
		document.getElementById("lobby_set").style = "display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;";
		document.getElementById("name_set").style = "display:none;";
	// Else show error message
	}else{
		// Clear error message after X ms where X is setTimeout(function(){do stuff here},X)
		document.getElementById("username_error").style = "display:block;";
		document.getElementById("username_error").innerHTML = "Username Taken";
		setTimeout(function(){
			document.getElementById("username_error").style = "display:none;";
		},3200)
	}
});

socket.on("start_game", function(accepted) {
    document.getElementById("canvas").style = "display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;";
    document.getElementById("lobby").style = "display:none;";
})

// 
// 
// JavaScript here
// 
// 

//this function is automatically called whenever Set_name button  is clicked
function enterName() {
	var n = document.getElementById("name").value;
	if(n != ""){
		socket.emit("set_username", n);
		playerName = n;
	}else{
		//error message for a username not being entered
		document.getElementById("username_error").style = "display:block;";
		document.getElementById("username_error").innerHTML = "Please Select A Username";
		setTimeout(function(){
			document.getElementById("username_error").style = "display:none;";
		}, 3200)
	}

}

//this function is automatically called whenever Create_lobby button  is clicked
function createLobby(){
	var l_name = document.getElementById("lobby_input").value
	socket.emit("create_lobby", l_name);
}

function joinLobby() {
	var l_name = document.getElementById("lobby_input").value
	socket.emit("join_lobby", l_name);
}

//self explanatory here, just setting up canvas size and making sure its drawn in the right place
function setup() {
	// put setup code here
	var c = createCanvas(500, 400)
	var canvasDiv = document.getElementById("canvas");
	c.parent(canvasDiv);
	background(7, 99, 36);
	fill(255);
}

//This draw function runs every frame
function draw() {
	text(playerName, 10, 10)

}