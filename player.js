class Player {
    constructor() {
        this.size = 10;
        this.x = 20;
        this.y = 20;
        this.speed = 4;
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
        this.boundingBox.detectWallCollision();
    }
}
