//self explanatory here, just setting up canvas size and making sure its drawn in the right place
function setup() {
  // put setup code here
	var c = createCanvas(500,400)
	var canvasDiv = document.getElementById("canvas")
	c.parent(canvasDiv)
	background(0)
}



//This draw function runs every frame
function draw() {
	//messing around
  var r = random(255)
  var g = random(255)
  var b = random(255)
 	
  fill(r,g,b)
  ellipse(random(500), random(400), 50, random(40,55));
}