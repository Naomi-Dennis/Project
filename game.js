class Game {
    constructor() {
        this.level = new Maze();
        this.player = new Player();
        this.screen = new Display();
        this.level.init(this.screen);
        var location = this.level.getInitialPlayerLocation();
        this.player.x = location.x;
        this.player.y = location.y;
        this.screen.setLevel(this.level);
        this.screen.addActor(this.player);
        this.level.generatePellets();
        this.player.interactWithLevel(this.level);
        this.playerControls();
    }
    start() {
        this.screen.render();
    }
    addActor(actor) {
        this.screen.addActor(actor);
    }
    playerControls() {
        $(document).keypress(this.playerControlHandle(this));
    }
    updatePoints() {
        ctx.font = "15px Courier New";
        ctx.fillStyle = "#ffffff";

        ctx.fillText("Points: " + points.toString(), canvas.width - 100, 15);
    }
    playerControlHandle(that) {
        return function (event) {
            var player = that.player;
            var screen = that.screen;
            if (event.which == 97) { //left - a
                player.decreaseX();
            } else if (event.which == 100) { //right - d
                player.increaseX();
            } else if (event.which == 115) { //down - s 
                player.increaseY();
            } else if (event.which == 119) { //up - w
                player.decreaseY();
            }
            screen.refresh();
        }
    }
}


class BoundingBox {
    constructor(mob, level) {
        this.mob = mob;
        this.level = level;
        this.colors_to_collide = [];
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
        for (var i in this.colors_to_collide) {
            obj = this.colors_to_collide[i];
            var left_hit = this.getBounding(coords, dimensions, "left", obj.color).left;
            var right_hit = this.getBounding(coords, dimensions, "right", obj.color).right;
            var top_hit = this.getBounding(coords, dimensions, "top", obj.color).top;
            var bottom_hit = this.getBounding(coords, dimensions, "bottom", obj.color).bottom;
            //console.log("color: " + obj.color + " L: " + left_hit + " R: " + right_hit + " U:" + top_hit + " D:" + bottom_hit)
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
        }
    }
    collideWithColor(newColor, newHandle) {
        this.colors_to_collide.push({
            color: newColor,
            handle: newHandle
        });
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
