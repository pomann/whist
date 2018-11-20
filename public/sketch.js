//Get the player name from the input field and send it to the server
var socket = io.connect();
var playerName
//this function is automatically called whenever the button on the page is clicked
function enterName() {
	var n = document.getElementById("name").value
	socket.emit("set_username", n)
	playerName = n

}

//self explanatory here, just setting up canvas size and making sure its drawn in the right place
function setup() {
	// put setup code here
	var c = createCanvas(500, 400)
	var canvasDiv = document.getElementById("canvas")
	c.parent(canvasDiv)
	background(7, 99, 36)
	fill(255)


}

//This draw function runs every frame
function draw() {
	text(playerName, 10, 10)

}