// Set up global variables to be able to use in all functions
let img
let imgSize = 100
let imgX
let imgY
let yvel, xvel
let red, green, blue
let boing;

// Preload the image before drawing it for better performance
function preload() {
  img = loadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8j2ZvogClZN_eBG7qKeZUCcHweqjjsulAsOGOzKvhkQ2iEEzF")
  boing = loadSound("boing.wav");
}

// Setup executes once when program starts
function setup() {
  // Create a canvas with width of 600, height of 400
  createCanvas(600, 400)


  // Assign random values to velocities and x and y coordinates
  yvel = random(2, 5)
  xvel = random(2, 6)
  imgX = random(0, width - imgSize)
  imgY = random(0, height - imgSize)

  // Assign random rgb values to randomize color
  setRandomColor();
}

function setRandomColor() {
  red = random(0, 255)
  blue = random(0, 255)
  green = random(0, 255)
}

// Draw executes 60 times per second to create animation
function draw() {

  // Draw a black background
  background(0)

  // Colorize images with tint
  tint(red, green, blue)

  // Draw image to canvas given x and y coordinates of upper left hand corner
  image(img, imgX, imgY, imgSize, imgSize)

  // Create movement by changing where image is drawn by adding velocities
  imgX += xvel
  imgY += yvel

  // Reverse velocities when image hits boundaries of canvas
  if (imgX + imgSize >= width || imgX <= 0) {
    xvel = -xvel
    setRandomColor();
    boing.play();
  }

  if (imgY + imgSize >= height || imgY <= 0) {
    yvel = -yvel
    setRandomColor();
    boing.play();
  }

  if (imgX <= 0 && imgY <= 0) {
    celebrate();
  }

  if (imgX <= 0 && (imgY + imgSize) >= height) {
    celebrate();
  }

  if (imgX + imgSize >= width && imgY <= 0) {
    celebrate();
  }

  if (imgX + imgSize >= width && (imgY + imgSize) >= height) {
    celebrate();
  }

}

function celebrate() {
  // Stop the Image
  xvel = 0;
  yvel = 0;
  alert('Hooray!!');
  // Reset Animation
  yvel = random(2, 5)
  xvel = random(2, 6)
  imgX = random(0, width - imgSize)
  imgY = random(0, height - imgSize)
}