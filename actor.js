class Actor {
    constructor() {
        this.size = 0;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.onStage = true;
        this.boundingBox = new BoundingBox(this, null)
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
        this.boundingBox.checkColorCollision()
    }
    addToStage() {
        this.onStage = true;
    }
    removeFromStage() {
        this.onStage = false;
    }
};
class Player extends Actor {
    constructor() {
        super();
        this.size = 10;
        this.x = 20;
        this.y = 20;
        this.speed = 2;
        this.onStage = true;
        this.boundingBox = new BoundingBox(this, null)
    }
    detectCollision() {
        this.boundingBox.detectWallCollision();
        this.boundingBox.checkColorCollision()
    }
}
class EndingPoint extends Actor {
    constructor() {
        super();
        this.size = 15;
        this.boundingBox.collideWithColor("#ffffff", this.loadNextLevel.bind(this));
    }
    render() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#0000aa"
        ctx.moveTo(this.x, this.y)
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = "#0000ff"
        ctx.fill()
        ctx.stroke();
    }
    loadNextLevel() {
        myGame.gotoNextLevel();
    }
}
class Pellet extends Actor {
    constructor() {
        super();
        this.point = 1;
        this.size = 3; //radius in this case, cuz it's a circle
        this.boundingBox.collideWithColor("#ffffff", this.gainPoint.bind(this));
    }
    render() {
        //This creates a basic circle; don't change it. 
        //Go to w3schools to find more info.
        //https://www.w3schools.com/tags/canvas_arc.asp
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ccb100"
        ctx.moveTo(this.x, this.y)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffdd00"
        ctx.fill()
        ctx.stroke();


    }
    gainPoint() {
        points++;
        myGame.screen.removeActor(this);
    }

};
