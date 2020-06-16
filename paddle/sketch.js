let paddleW = 100;
let paddleH = 20;
let paddleX = 250;
let paddleY = 375;
let ballX, ballY;
let diameter = 30;
let radius = diameter / 2;
let xvel, yvel;

// Lives Management
let livesElem;
let maxLives = 3;
let lives = maxLives;

function setup() {
    livesElem = createDiv(`Lives: ${maxLives}`);
    livesElem.position(20, 20);
    livesElem.id = 'lives';
    livesElem.style('color', 'white');
    livesElem.style('font-size', '32px');
    livesElem.style('font-family', 'sans-serif');

    createCanvas(600, 400);
    textSize(32);
    ballX = random(width);
    ballY = 0;
    xvel = 1;
    yvel = 3;
}

function draw() {
    background(0);

    fill(255);
    rect(paddleX, paddleY, paddleW, paddleH);

    if (keyIsPressed) {
        if (keyCode == LEFT_ARROW && paddleX > 0) {
            paddleX -= 5;
        } else if (keyCode == RIGHT_ARROW && paddleX + paddleW < width) {
            paddleX += 5;
        }
    }

    fill('RED');
    circle(ballX, ballY, diameter);

    ballX += xvel;
    ballY += yvel;

    if (collide()) {
        yvel = -yvel;
    }

    if (hitEdges()) {
        xvel = -xvel;
    }

    if (lifeLost()) {
        lives = lives - 1;
        livesElem.html(`Lives: ${lives}`);
        noLoop();
    }

    if (gameOver()) {
        livesElem.html(`Game Over, Man!`);
        noLoop();
    }
}

function gameOver() {
    return lives <= 0;
}

function mouseClicked() {
    if (lives <= 0) {
        lives = maxLives;
        livesElem.html(`Lives: ${lives}`);
    }
    ballX = random(width);
    ballY = 0;
    loop();
}

function lifeLost() {
    return ballY - radius >= height;
}

function collide() {
    if (
        ballY + radius >= paddleY &&
        (ballX > paddleX) & (ballX <= paddleX + paddleW)
    ) {
        return true;
    }
}

function hitEdges() {
    if (ballX - radius <= 0 || ballX + radius >= width) {
        return true;
    }

    if (ballY <= 0) {
        yvel = -yvel;
    }
}