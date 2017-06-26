class Game {
    constructor() {
        this.fireColor = '#ff4907';
        this.iceColor = '#4286f4';
        this.windColor = '#eff1f2';
        this.normalColor = '#777777';
        this.events = {};
        this.currentLevel = 0;
        this.moveUp = false;
        this.moveDown = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.fireShot = false;
        this.switchToNormalBullets = false;
        this.switchToFireBullets = false;
        this.switchToIceBullets = false;
        this.switchToWindBullets = false;
        this.level = new Maze();
        this.player = new Player();
        this.screen = new Display();
        this.playerControls();
        this.gotoNextLevel();
        setInterval(this.updateScreen.bind(this), 16.67);

    }
    gotoNextLevel() {
        /*
            - Clear the all screen actors
            - Set Level 
            - Initialize Level with the screen
            - Set initial player location
            - Set the level on the screen
            - Add the player to the screen
            - Generate pellets
            - Show the ending location
            - Set the player to interact with the new level
        */
        this.currentLevel++;
        this.screen.clearAllActors();
        this.level = new Maze();
        this.level.init(this.screen);
        var location = this.level.getInitialPlayerLocation();
        this.player.x = location.x;
        this.player.y = location.y;
        this.screen.setLevel(this.level);
        this.screen.addActor(this.player);
        this.level.getEndingLocation();
        this.level.generatePellets();
        this.level.generateTraps(["fire", "ice"]);
        this.player.interactWithLevel(this.level);
    }
    updateScreen() {
        if (this.moveDown) {
            this.player.direction = "down"
            this.player.increaseY();
        } else if (this.moveUp) {
            this.player.direction = "up"
            this.player.decreaseY();
        } else if (this.moveRight) {
            this.player.direction = "right"
            this.player.increaseX();
        } else if (this.moveLeft) {
            this.player.direction = "left"
            this.player.decreaseX();
        }


        if (this.fireShot) {
            this.fireShot = false;
            this.player.fireBullet();
        } else if (this.switchToNormalBullets) {
            this.player.switchTo("normal");
        } else if (this.switchToFireBullets) {
            this.player.switchTo("fire");
        } else if (this.switchToIceBullets) {
            this.player.switchTo("ice");
        } else if (this.switchToWindBullets) {
            this.player.switchTo("wind");
        }
        this.fireEvents();
        this.screen.refresh();
    }
    fireEvents() {
        for (var event_name in this.events) {
            this.events[event_name]();
        }
    }
    addEvent(event_name, foo) {
        this.events[event_name] = foo;
    }
    removeEvent(event_name) {
        delete this.events[event_name];
    }
    start() {
        this.screen.render();
    }
    addActor(actor) {
        this.screen.addActor(actor);
    }
    playerControls() {
        $(document).keydown(this.playerControlDown.bind(this))
        $(document).keyup(this.playerControlUp.bind(this))
    }
    updatePoints() {
        var offset = 60;
        this.createText("P:" + points.toString(), canvas.width - offset);
        this.createText("B:" + this.player.ammo.toString(), canvas.width - (offset) * 2);
        this.createText("F:" + this.player.fireAmmo.toString(), canvas.width - (offset) * 4);
        this.createText("I:" + this.player.iceAmmo.toString(), canvas.width - (offset) * 3);
        this.createText("W:" + this.player.windAmmo.toString(), canvas.width - (offset) * 5);
    }
    createText(msg, x, y = 15) {
        ctx.font = "15px Courier New";
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.fillText(msg, x - 20, y);
        ctx.closePath();
    }
    playerControlDown(event) {
        if (event.which == 65) { //left - a
            this.moveLeft = true;
        } else if (event.which == 68) { //right - d
            this.moveRight = true;
        } else if (event.which == 83) { //down - s 
            this.moveDown = true;
        } else if (event.which == 87) { //up - w
            this.moveUp = true;
        } else if (event.which == 32) {
            this.fireShot = true;
        }

        if (event.which == 71) { //switch to normal bullets - g
            this.switchToNormalBullets = true;
        } else if (event.which == 72) { //switch to fire bullets = h
            this.switchToFireBullets = true;
        } else if (event.which == 74) { //switch to ice bullets = j
            this.switchToIceBullets = true;
        } else if (event.which == 75) { //switch to wind bullets = k
            this.switchToWindBullets = true;
        }
    }
    playerControlUp(event) {
        if (event.which == 65) { //left - a
            this.moveLeft = false;
        } else if (event.which == 68) { //right - d
            this.moveRight = false;
        } else if (event.which == 83) { //down - s 
            this.moveDown = false;
        } else if (event.which == 87) { //up - w
            this.moveUp = false;
        } else if (event.which == 32) {
            this.fireShot = false;
        }

        if (event.which == 71) { //switch to normal bullets - g
            this.switchToNormalBullets = false;
        } else if (event.which == 72) { //switch to fire bullets = h
            this.switchToFireBullets = false;
        } else if (event.which == 74) { //switch to ice bullets = j
            this.switchToIceBullets = false;
        } else if (event.which == 75) { //switch to wind bullets = k
            this.switchToWindBullets = false;
        }
    }
}


class BoundingBox {
    constructor(mob, level) {
        this.mob = mob;
        this.level = level;
        this.colors_to_collide = [];
        this.mobs_to_collide = [];
        this.nCollisions = 0;
    }
    setLevel(level) {
        this.level = level;
    }
    checkColorCollision() {
        var obj;
        var dimensions = {
            width: this.mob.size,
            height: this.mob.size
        };
        var coords = {
            x: this.mob.x,
            y: this.mob.y
        };
        var left_hit
        var right_hit
        var top_hit
        var bottom_hit
        var position_hit;
        for (var i in this.colors_to_collide) {
            obj = this.colors_to_collide[i];
            if (obj.target == null) {
                left_hit = this.getBounding(coords, dimensions, "left", obj.color).left;
                right_hit = this.getBounding(coords, dimensions, "right", obj.color).right;
                top_hit = this.getBounding(coords, dimensions, "top", obj.color).top;
                bottom_hit = this.getBounding(coords, dimensions, "bottom", obj.color).bottom;
                if (left_hit) {
                    obj.handle();
                    break;
                } else if (right_hit) {
                    obj.handle();
                    break;
                } else if (top_hit) {
                    obj.handle();
                    break;
                } else if (bottom_hit) {
                    obj.handle();
                    break;
                }
            } else {
                if (obj.target != null && obj.target.onStage) {
                    position_hit = this.detectCoordCollision(obj.target)
                    if (!position_hit) {
                        continue;
                    } else {
                        obj.handle();
                        break;
                    }
                }
            }
        }
    }

    collideWithColor(newColor, newHandle, target = null) {
        var obj = {};
        var that = this;
        if (target != null) {
            obj.color = newColor;
            obj.handle = newHandle;
            obj.target = target;
            obj.bounding = that;
            obj.id = that.nCollisions;
        } else {
            obj.color = newColor;
            obj.handle = newHandle;
            obj.bounding = that;
            obj.id = that.nCollisions;
        }
        this.colors_to_collide.push(obj);
    }
    removeCollision(collisionObject) {
        this.colors_to_collide.splice(this.colors_to_collide.indexOf(collisionObject), 1);
    }
    detectCoordCollision(mob_to_detect) {
        var mob = this.mob;
        var detect_coords = {
            x: mob_to_detect.x,
            y: mob_to_detect.y,
            width: mob_to_detect.width,
            height: mob_to_detect.height
        }
        var maxX = detect_coords.x + detect_coords.width;
        var maxY = detect_coords.y + detect_coords.height;
        if (mob.x < maxX && mob.x > detect_coords.x && mob.y > detect_coords.y && mob.y < maxY) {
            return true;
        }
        return false;

    }
    detectWallCollision() {
        var dimensions = {
            width: this.mob.size,
            height: this.mob.size
        };
        var coords = {
            x: this.mob.x,
            y: this.mob.y
        };
        var left_hit = this.getBounding(coords, dimensions, "left", this.level.mazeColor).left;
        var right_hit = this.getBounding(coords, dimensions, "right", this.level.mazeColor).right;
        var top_hit = this.getBounding(coords, dimensions, "top", this.level.mazeColor).top;
        var bottom_hit = this.getBounding(coords, dimensions, "bottom", this.level.mazeColor).bottom;
        if (left_hit) {
            this.mob.increaseX();
        }
        if (right_hit) {
            this.mob.decreaseX();
        }
        if (top_hit) {
            this.mob.increaseY();
        }
        if (bottom_hit) {
            this.mob.decreaseY()
        }
    }
    getBounding(location, dimensions, side, color) {
        var offset = 1;
        var start_x;
        var start_y;
        var height = dimensions.height;
        var width = dimensions.width;
        var hitting_left = false;
        var hitting_right = false;
        var hitting_top = false;
        var hitting_bottom = false;
        var img_data;
        if (side == "left") {
            start_x = location.x - offset;
            start_y = location.y;
            img_data = ctx.getImageData(start_x, start_y, offset, height);
            var left_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            left_color = "#" + left_color;
            hitting_left = (left_color == color);
        } else if (side == "right") {
            start_x = location.x + dimensions.width;
            start_y = location.y;
            img_data = ctx.getImageData(start_x, start_y, offset, height);
            var right_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            right_color = "#" + right_color;
            hitting_right = (right_color == color);
        } else if (side == "top") {
            start_x = location.x;
            start_y = location.y - offset;
            img_data = ctx.getImageData(start_x, start_y, width, offset);
            var top_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            top_color = "#" + top_color;
            hitting_top = (top_color == color);
        } else if (side == "bottom") {
            start_x = location.x;
            start_y = location.y + dimensions.height;
            img_data = ctx.getImageData(start_x, start_y, width, offset);
            var bottom_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            bottom_color = "#" + bottom_color;
            hitting_bottom = (bottom_color == color);
        }
        return {
            left: hitting_left,
            right: hitting_right,
            bottom: hitting_bottom,
            top: hitting_top
        }
    }
}
