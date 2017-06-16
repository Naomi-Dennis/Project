class Actor {
    constructor() {
        this.size = 10;
        this.x = 20;
        this.y = 20;
        this.speed = 4;
        this.onStage = true;
        this.boundingBox = new BoundingBox(this, null);
    }
    render() {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    increaseX(n) {
        if (n == undefined) {
            n = this.speed;
        }
        this.x += n;
    }
    increaseY(n) {
        if (n == undefined) {
            n = this.speed;
        }
        this.y += n;
    }
    decreaseX(n) {
        if (n == undefined) {
            n = this.speed;
        }
        this.x -= n;
    }
    decreaseY(n) {
        if (n == undefined) {
            n = this.speed;
        }
        this.y -= n;
    }
    interactWithLevel(level) {
        this.boundingBox.setLevel(level);
    }
    detectCollision() {
        // this.boundingBox.detectWallCollision();
        this.boundingBox.checkColorCollision()
    }
    addToStage() {
        this.onStage = true;
    }
    removeFromStage() {
        this.onStage = false;
    }
};

class Pellet extends Actor {
    constructor() {
        super();
        this.point = 1;
        this.size = 3; //radius in this case, cuz it's a circle
        this.x = 40;
    }
    render() {
        //This creates a basic circle; don't change it. 
        //Go to w3schools to find more info.
        //https://www.w3schools.com/tags/canvas_arc.asp
        ctx.fillStyle = "#ffdd00"
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill()
        this.boundingBox.collideWithColor("#ffffff", this.gainPoint.bind(this));
    }
    gainPoint() {
        points++;
        this.removeFromStage();
    }
};
