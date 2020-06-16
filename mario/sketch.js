let tileSpriteSheet
let gamemap
let alienSpriteSheet
let alien
let alienSprites
let rows, cols
let tiles = []
let platforms = []
let rez = 2
let viewX = 0
let viewY = 0
let coins = 0
let lives = 3
let coinSound, hitSound, musicSound, jumpSound, deathSound
let gameOver = false
let coinCount = 0


const SPACE = 32

const WALKING_SPEED = 3
const JUMP_VELOCITY = 14
const GRAVITY = 0.6

// define player
const PLAYER = '-1'

// define tiles
const TILE_BRICK = '0'
const TILE_EMPTY = '3'

// cloud blocks
const CLOUD_LEFT = '5'
const CLOUD_RIGHT = '6'

// bush blocks
const BUSH_LEFT = '1'
const BUSH_RIGHT = '2'

// mushroom tiles
const MUSHROOM_TOP = '9'
const MUSHROOM_BOTTOM = '10'

// jump block
const JUMP_BLOCK = '4'
const JUMP_BLOCK_HIT = '8'

// pole
const POLE_TOP = '7'
const POLE_MIDDLE = '11'
const POLE_BOT = '15'

// flag
const FLAG_LEFT = '12'
const FLAG_MID = '13'
const FLAG_RIGHT = '14'

const COLLIDABLES = [TILE_BRICK, JUMP_BLOCK, JUMP_BLOCK_HIT, MUSHROOM_TOP, MUSHROOM_BOTTOM, PLAYER, POLE_BOT, POLE_MIDDLE, POLE_TOP]

// margins
const LEFT_MARGIN = 60
const VERTICAL_MARGIN = 15
const RIGHT_MARGIN = 150

function preload() {
    tileSpriteSheet = loadImage('graphics/spritesheet12.png')
    alienSpriteSheet = loadImage('graphics/new_alien6.png')
    gamemap = loadTable('graphics/gamemap9.csv')
    coinSound = loadSound('sounds/coin.wav')
    hitSound = loadSound('sounds/hit.wav')
    jumpSound = loadSound('sounds/jump.wav')
    deathSound = loadSound('sounds/death.wav')
}

function setup() {
    createCanvas(850, 480)
    frameRate(30)
    init()
}

function createAlien() {
    idleAlien = [alienSprites[0]]
    walkingAlien = alienSprites.slice(7, 11)
    jumpingAlien = [alienSprites[3]]

    alien = new AnimatedSprite(idleAlien[0], 160, 188, 'PLAYER', walkingAlien, idleAlien, jumpingAlien)
}

function createPlatforms(gamemap) {
    platforms = [];
    coinCount = 0;
    rows = gamemap.getRowCount();
    cols = gamemap.getColumnCount();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let spriteIndex = gamemap.getString(r, c);
            let sprite = tiles[spriteIndex];
            let tile;

            if (spriteIndex === FLAG_LEFT) {
                tile = new AnimatedFlag(
                    sprite,
                    sprite.width * c,
                    sprite.height * r,
                    'FLAG',
                    [sprite],
                    [tiles[FLAG_MID]],
                    [tiles[FLAG_RIGHT]]
                );
            } else {
                tile = new Sprite(
                    sprite,
                    sprite.width * c,
                    sprite.height * r,
                    spriteIndex
                );
            }
            platforms.push(tile);
            if (spriteIndex == JUMP_BLOCK) {
                coinCount++;
            }
        }
    }
}

function init() {
    viewX = 0
    viewY = 0
    coins = 0
    lives = 3

    translate(viewX, viewY)

    tiles = generateTiles(tileSpriteSheet, 16, 16)
        createPlatforms(gamemap)

        alienSprites = generateTiles(alienSpriteSheet, 16, 20)
        createAlien()
}

function draw() {
    background('#6b88ff')
    scale(rez)
    scroll()

    for (let tile of platforms) {
        tile.display()
    }

    alien.display()
    resolvePlatformCollisions(alien, platforms)

    checkGameOver()
    displayScore()
}

function checkGameOver() {
    if (!gameOver) {
        checkDeath()
    }

    if (lives == 0){
        //game over
        fill(255, 255, 255)
        textAlign(CENTER)
        text("Game Over", width/4 + viewX, height/4 + viewY)
        text("Click to Restart", width/4 + viewX, height/4 + 20 + viewY)
        noLoop()
    }
    else if (coins == coinCount) {
        fill(255, 255, 255)
        textAlign(CENTER)
        text("You collected all the coins!", width/4 + viewX, height/4 + viewY)
        text("Click to Restart", width/4 + viewX, height/4 + 20 + viewY)
        gameOver = true
        //noLoop()
    }
}

function mousePressed() {
    if (gameOver) {
        gameOver = false
        init()
        loop()
    }
}

function checkDeath() {
    if (alien.getTop() > rows * 16 + 1000) {
        lives--
        if (lives == 0) {
            gameOver = true
        }
        else {
            viewX = 0
            viewY = 0
            translate(viewX, viewY)
            alien.x = 160
            alien.y = 188
            deathSound.play()
        }
    }
}

function displayScore() {
    fill(255, 255, 255)
    textAlign(LEFT)
    text("Coins: " + coins, viewX + 15, viewY + 20)
    text("Lives: " + lives, viewX + 15, viewY + 35)
}

function scroll() {
    let rightBound = viewX + width / rez - RIGHT_MARGIN
    // here our backdrop ends at an x value of 260
    if (alien.getRight() > rightBound && viewX < 2750) {
    //if (alien.getRight() > rightBound) {

        // add () to the end of getRight()
        viewX += alien.getRight() - rightBound
    }

    let leftBound = viewX + LEFT_MARGIN
    if (alien.getLeft() < leftBound && viewX >0) {
        viewX -= leftBound - alien.getLeft()
    }

    let bottomBound = viewY + height / rez - VERTICAL_MARGIN
    if (alien.getBottom() > bottomBound) {
        viewY += alien.getBottom() - bottomBound
    }

    let topBound = viewY + VERTICAL_MARGIN
    if (alien.getTop() < topBound) {
        viewY -= topBound - alien.getTop()
    }

    translate(-viewX, -viewY)
}

// also update alien's position
function resolvePlatformCollisions(s, list) {
    s.dy += GRAVITY
    s.y += s.dy

    let collisions = checkCollisionList(s, list)
    if (collisions.length > 0) {
        let collided = collisions[0]
        if (s.dy > 0) {
            // falling down so bottom of alien gets top of collided
            s.setBottom(collided.getTop())
        }
        else if (s.dy < 0) {
            //alien is jumping
            s.setTop(collided.getBottom())

            //check if jump block is hit
            if (collided.type == JUMP_BLOCK) {
                collided.img = tiles[JUMP_BLOCK_HIT]
                collided.type = JUMP_BLOCK_HIT
                coinSound.play()
                coins++
            }
            else if (collided.type == JUMP_BLOCK_HIT) {
                //play hit sound
                hitSound.play()
            }
        }
        // stop falling or jumping
        s.dy = 0
    }

    //check left and right
    s.x += s.dx
    collisions = checkCollisionList(s, list)
    if (collisions.length > 0) {
        let collided = collisions[0]
        // moving right
        if (s.dx > 0) {
            s.setRight(collided.getLeft())
        }
        // moving left
        else if (s.dx < 0) {
            s.setLeft(collided.getRight())
        }
    }
}

function keyPressed() {
    if (!gameOver) {
        if (keyCode == LEFT_ARROW) {
            alien.dx = -WALKING_SPEED
            alien.state = 'walking'
        }
        else if (keyCode ==RIGHT_ARROW) {
            alien.dx = WALKING_SPEED
            alien.state = 'walking'
        }
        else if (keyCode == SPACE && isOnPlatform(alien, platforms)) {
            alien.dy = -JUMP_VELOCITY
            alien.state = 'jumping'
            jumpSound.play()
        }
        else {
            alien.state = 'idle'
        }
    }
}

function keyReleased() {
    if (keyCode == LEFT_ARROW) {
        alien.dx = 0
        alien.state = "idle"
    }
    else if (keyCode == RIGHT_ARROW) {
        alien.dx = 0
        alien.state = "idle"
    }
    else if (keyCode == SPACE) {
        alien.dy = 0
        alien.state = "idle"
    }
}

// function alienUpdate() {
//     alien.x += alien.dx
//     alien.y += alien.dy
// }

function checkCollision(s1, s2) {

    // add () after getRight
    let noXOverlap = s1.getRight() <= s2.getLeft() || s1.getLeft() >= s2.getRight()
    let noYOverlap = s1.getBottom() <= s2.getTop() || s1.getTop() >= s2.getBottom()

    if (noXOverlap || noYOverlap) {
        return false
    }
    else {
        return true
    }
}

function checkCollisionList(s, list) {
    let collisionList = []
    for (let sprite of list) {
        if (checkCollision(s, sprite) && sprite.collidable) {
            collisionList.push(sprite)
        }
    }
    return collisionList
}

function isOnPlatform(s, list) {
    s.y += 5
    let collisions = checkCollisionList(s, list)
    s.y -= 5
    if (collisions.length > 0) {
        return true
    }
    else {
        return false
    }
}

class AnimatedFlag extends Sprite {
    constructor(img, x, y, type, left, mid, right) {
        super(img, x, y, type);
        this.dx = 0;
        this.dy = 0;
        this.state = 'left';
        this.left = left;
        this.mid = mid;
        this.right = right;
    }

    changeState() {
        if (this.state === 'left') {
            this.state = 'mid';
        } else if (this.state === 'mid') {
            this.state = 'right';
        } else {
            this.state = 'left';
        }
    }

    display() {
        if (frameCount % 5 === 0) {
            this.changeState();
        }
        if (this.state == 'left') {
            this.animation = this.left;
        } else if (this.state == 'right') {
            this.animation = this.right;
        } else if (this.state == 'mid') {
            this.animation = this.mid;
        }

        let numImages = this.animation.length;

        image(this.animation[frameCount % numImages], this.x, this.y);
    }
}