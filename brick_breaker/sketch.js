let ball, paddle, score, hit
let rows = 5
let cols = 10
let brickWidth
let brickHeight = 10
let bricks = []
let color = ["RED", "SALMON", "ORANGE", "YELLOW", "WHITE"]
let gameOver = ""
let bgImg;
let bgX1 = 0;
let bgX2;
let bgScrollSpeed = 2;

function preload() {
    hit = loadSound('hit.wav')
    bgImg = loadImage("bg.png");
}

function setup() {
  createCanvas(400, 600)
  brickWidth = (width - cols) / cols - 4

  bgColor = random(["WHITE", "RED", "BLUE", "GRAY"])
  bgX2 = width;

  ball = {
    x: width/2,
    y: height/2,
    d: 20,
    xv: random(2, 3),
    yv: 3,
    c: "RED"
  }

  paddle = {
    x: width/2 - 30,
    y: height - 20,
    w: 60,
    h: 10,
    c: "WHITE"
  }

  gameInit()
}

function gameInit(){
    lives = 3
    score = 0
    ball.xv = random(2, 5),

    bricks =[]

    ball.y = height/2
    ball.x = width/2

    for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      brick = {
        x: j * (brickWidth + 5) + 2,
        y: i * (brickHeight + 5) + 2,
        c: color[i]
      }
      bricks.push(brick)
    }
  }
}



function draw() {
  displayBackground()

  displayBall()
  updateBall()
  checkEdges()

  displayPaddle()
  paddleMove()
  paddleCollide()

  countLives()
  displayLives()

  displayBricks()
  hitBrick()

  checkWin()
  displayScore()


}

function displayBackground() {
  image(bgImg, bgX1, 0, width, height);
  image(bgImg, bgX2, 0, width, height);

  bgX1 -= bgScrollSpeed;
  bgX2 -= bgScrollSpeed;

  if (bgX1 < -width){
    bgX1 = width;
  }
  if (bgX2 < -width){
    bgX2 = width;
  }
}

function displayBricks() {
  for (let brick of bricks) {
    fill(brick.c)
    rect(brick.x, brick.y, brickWidth, brickHeight)
  }
}

function hitBrick() {
    for (let i = bricks.length - 1; i >= 0; i--) {
        if (ball.x > bricks[i].x &&
            ball.x < bricks[i].x + brickWidth &&
            ball.y - ball.d/2 < bricks[i].y + brickHeight) {
                bricks.splice(i, 1)
                ball.yv = -ball.yv
                score++
                hit.play()
                return
            }
    }
}

function displayScore(){
    textSize(36)
    fill("WHITE")
    textAlign(CENTER)
    text(score, width/2, height/2)
}

function paddleMove() {
  if (keyIsDown(LEFT_ARROW)) {
    paddle.x -= 10
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    paddle.x += 10
  }
  paddle.x = constrain(paddle.x, 0, width - paddle.w)
}

function displayPaddle() {
  fill(paddle.c)
  rect(paddle.x, paddle.y, paddle.w, paddle.h)
}

function displayBall() {
  fill(ball.c)
  circle(ball.x, ball.y, ball.d)
}

function updateBall() {
  ball.x += ball.xv
  ball.y += ball.yv
}

function checkEdges() {
  if (ball.x <= 0 || ball.x >= width) {
    ball.xv = -ball.xv
  }

  if (ball.y <= 0) {
    ball.yv = -ball.yv
  }
}

function paddleCollide() {
  if (ball.y + ball.d/2 >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.w) {
        ball.yv = -ball.yv
        ball.y = paddle.y - ball.d/2
      }
}

function checkWin() {
    if (score == rows * cols) {
      gameOver = "YOU WIN!"
    }
    else if (lives == 0) {
      gameOver = "YOU LOSE!"
    }
    else {
      return
    }

    fill("RED")
    textSize(36)
    textStyle(BOLD)
    textAlign(CENTER)
    text(gameOver, width/2, height/2 + 50)
    fill("WHITE")
    textSize(18)
    text("Click to Restart", width/2, height/2 + 80)
    // perhaps reset velocities to 0
    noLoop()
}

function countLives() {
  if (ball.y >= height + ball.d) {
    lives--
    ball.y = height/2
    ball.x = width/2
    noLoop()
  }
}

function displayLives() {
  textSize(12)
  fill("WHITE")
  textAlign(LEFT)
  text("Lives Remaining: " + lives, 10, height - 30)
}

function mousePressed() {
    if (score == rows * cols || lives == 0) {
        gameInit()
        loop()
    }
    else {
        loop()
    }
}