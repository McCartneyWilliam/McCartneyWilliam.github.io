let x, y
let d = 20
let xspeed, yspeed
let lPadX, lPadY, rPadX, rPadY
let padH = 80
let padW = 10
let lScore = 0
let rScore = 0

function preload() {
  ponghit = loadSound("ponghit.wav")
  pongbounce = loadSound("pongbounce.wav")
  pongscore = loadSound("pongscore.wav")
}

function setup() {
  createCanvas(600, 400)
  x = width / 2
  y = height / 2
  xspeed = random(2, 4)
  yspeed = random(2, 5)
  rectMode(CENTER)
  lPadX = padW
  rPadX = width - padW
  lPadY = height / 2
  rPadY = height / 2
}

function draw() {
  background(0)
  dashedLine(25)
  score()
  circle(x, y, d)
  move()

  rect(lPadX, lPadY, padW, padH)
  rect(rPadX, rPadY, padW, padH)

  paddleMove()
  edges()
  checkPadHit()
}

function checkPadHit() {
  // right paddle
  if (y > rPadY - padH/2 &&
      y < rPadY + padH/2 &&
      x + d/2 > rPadX - padW/2) {
        xspeed = -xspeed
        x = rPadX - padW/2 - d/2
        ponghit.play()
      }

  // left Paddle
  if (y > lPadY - padH/2 &&
      y < lPadY + padH/2 &&
      x - d/2 < lPadX + padW/2) {
        xspeed = -xspeed
        x = lPadX + padW/2 + d/2
        ponghit.play()
      }
}

function edges() {
  if (x < 0) {
    rScore++
    reset()
    pongscore.play()
  }

  if (x > width) {
    reset()
    lScore++
    pongscore.play()
  }

  if (y < 0 || y > height) {
    yspeed = -yspeed
    pongbounce.play()
  }
}

function reset() {
  x = width / 2
  y = height / 2
}

function paddleMove() {
  if (keyIsDown(UP_ARROW)) {
    rPadY -= 10
  }
  else if (keyIsDown(DOWN_ARROW)) {
    rPadY += 10
  }
  rPadY = constrain(rPadY, padH/2, height - padH/2)

  // checking for "w" and "s" keys for left paddle
  if (keyIsDown(87)) {
    lPadY -= 10
  }
  else if (keyIsDown(83)) {
    lPadY += 10
  }
  lPadY = constrain(lPadY, padH/2, height - padH/2)
}

function move() {
  x += xspeed
  y += yspeed
}

function score() {
  fill(255)
  noStroke()
  textAlign(CENTER)
  textSize(32)
  text(lScore, width/4, 50)
  text(rScore, 3*width/4, 50)
}

function dashedLine(pixels) {
  stroke(255)
  strokeWeight(2)
  let center = width / 2
  for (let i = 0; i < height / pixels; i++) {
    line(center, i * pixels + 5, center, i * pixels + 15)
  }
}