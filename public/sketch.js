//Get the player name from the input field and send it to the server
var socket = io.connect();
var playerName;
var hand = []

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

socket.on("player_hand",function(c){
	hand = c
	console.log(hand)
	for(var i = 0; i < hand.length; i++){
		let val = String(hand[i].value)
		let suit = hand[i].suit
		cards.push(val + suit)
	}
	console.log(cards)
})

socket.on("played_card", function(accepted) {
	if (accepted) {
		if (accepted[1] == 0) {
			played[0] = [cards[accepted[0]],420, 380, 60,90]
			cards.splice(accepted[0],1)
			init_me = init_me +30;
		}else if (accepted[1] == 1) {
			played[1] = [accepted[0],-30, 30, 60,90]
			init_left = init_left -30;
			left--;
		}else if (accepted[1] == 2) {
			played[2] = [accepted[0],420, 230, 60,90]
			init_up = init_up +30;
			up --;
		} else if (accepted[1] == 3) {
			played[3] = [accepted[0],-30, -120, 60,90]
			init_right = init_right -30;
			right--;
		}
	}else{
		console.log("not your turn")
	}
})

socket.on("new_round", function(accepted){
	played = [];
})

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
var suit = ["H","D","C","S"];
var cardback;
var cards = []
var played = [];
var init_me = 450 - (12 * 30 + 60) / 2;
var init_up = 450 - (12 * 30 + 60) / 2;
var init_left = (450 - (12 * 30 + 60) / 2) / 2 + 30;
var init_right = (450 - (12 * 30 + 60) / 2) / 2 + 30;
var up = 13;
var left = 13;
var right = 13;
var all_cards = {};
function setup() {
	// put setup code here
	var c = createCanvas(900, 700)
	var canvasDiv = document.getElementById("canvas");
	c.parent(canvasDiv);
	background(7, 99, 36);
	fill(255);
	
	cardback = loadImage("images/gray_back.png")

	for(var i = 0; i < suit.length; i++){
		for(var j = 1; j < 14; j++){
			
			if(j == 1) all_cards["A" + suit[i]] = loadImage("images/A" + suit[i] +".png");
			else if(j == 11) all_cards["J" + suit[i]] = loadImage("images/J" + suit[i] +".png");
			else if(j == 12) all_cards["Q" + suit[i]] = loadImage("images/Q" + suit[i] +".png");
			else if(j == 13) all_cards["K" + suit[i]] = loadImage("images/K" + suit[i] +".png");
			else all_cards[j + suit[i]] = loadImage("images/"+ j + suit[i] +".png");
		}
	}
}
// -30, 300 left cards center
// -30, -390 right cards center
//image()
//This draw function runs every frame
function draw() {
	background(7, 99, 36);
	text(playerName, 10, 10)
	let mX = mouseX
	let mY = mouseY

	// Draws Player's cards
	for(var i = 0 ; i < cards.length; i++){
		if(mX <= (init_me + 30 +(i*30)) && mX >= (init_me+(i*30)) && mY <= 640 && mY >= 550){
			image(all_cards[cards[i]],(init_me+(i*30)), 500, 60,90)	
		}else{
		image(all_cards[cards[i]],(init_me+(i*30)), 550, 60,90)
		}
	}
	// Draws played cards
	for (var i = 0; i < played.length; i = i + 2) {
		try{
			image(all_cards[played[i][0]],played[i][1],played[i][2],played[i][3],played[i][4])
		}catch(e){

		}
	}
	// Draws Teammates cards
	for (var i = 0; i < up; i++) {
		image(cardback,(init_up+(i*30)), 60, 60,90)
	}
	// Turns cards 90 degrees by rotating the entire fucking canvas because DDDDDD p5 kill me
	translate(width / 2, height / 2);
	rotate(PI/2);
	// Draws left opponent's cards
	for (var i = 0; i < left; i++) {
		image(cardback,(init_left-(i*30)), 300, 60,90)
	}
	// Draws right opponent's cards
	for (var i = 0; i < right; i++) {
		image(cardback,(init_right-(i*30)), -390, 60,90)
	}
	for (var i = 1; i < played.length; i = i + 2) {
		try{
			image(all_cards[played[i][0]],played[i][1],played[i][2],played[i][3],played[i][4])
		}catch(e){

		}
	}
}

function mousePressed() {
	let mX = mouseX
	let mY = mouseY
	for(var i = 0 ; i < cards.length; i++){
		if(mX <= (init_me + 30 +(i*30)) && mX >= (init_me+(i*30)) && mY <= 640 && mY >= 550){
			socket.emit("played_card",[i,cards[i]])
		}
	}
}