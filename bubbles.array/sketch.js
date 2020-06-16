let bubbles = [];

function createBubble() {
    return {
        x: random(0, width),
        y: random(0, height),
        size: random(20, 50),
        color: {
            r: random(0, 255),
            g: random(0, 255),
            b: random(0, 255),
        },
        clickCount: 0,
        click: function () {
            if (this.clickCount >= 2) {
                this.size = 0;
            }

            if (dist(this.x, this.y, mouseX, mouseY) <= this.size / 2) {
                this.color = {
                    r: random(0, 255),
                    g: random(0, 255),
                    b: random(0, 255),
                };

                this.size = this.size * 2;
                this.clickCount += 1;
                return true;
            }
            return false;
        },
    };
}

function setup() {
    createCanvas(500, 400);

    for (let i = 0; i < 100; i++) {
        bubbles.push(createBubble());
    }
}

function draw() {
    background(0);

    bubbles.forEach(function (bubble) {
        fill(bubble.color.r, bubble.color.g, bubble.color.b);
        circle(bubble.x, bubble.y, bubble.size);
        bubble.x += random(-2, 2);
        bubble.y += random(-2, 2);
    });
}

function mouseClicked(event) {
    let isBubbleClicked = false;
    bubbles.forEach(function (bubble) {
        isBubbleClicked = bubble.click(event.clientX, event.clientY);
    });

    if (!isBubbleClicked) {
        bubbles.push(createBubble());
    }
}