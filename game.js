class Game {
    constructor() {
        this.level = new Maze();
        this.level.init();
        this.player = new Player();
        this.screen = new Display();
        this.screen.setLevel(this.level);
        this.screen.addActor(this.player);
        this.player.interactWithLevel(this.level);
        this.screen.render();
        this.playerControls();

    }
    start() {}
    playerControls() {
        $(document).keypress(this.playerControlHandle(this));
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
    }
    setLevel(level) {
        this.level = level;
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
        var left_hit = this.getBounding(coords, dimensions, "left").left;
        var right_hit = this.getBounding(coords, dimensions, "right").right;
        var top_hit = this.getBounding(coords, dimensions, "top").top;
        var bottom_hit = this.getBounding(coords, dimensions, "bottom").bottom;
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
    getBounding(location, dimensions, side) {
        var offset = 1;
        var start_x;
        var start_y;
        var height = 1;
        var width = offset;
        var hitting_left = false;
        var hitting_right = false;
        var hitting_top = false;
        var hitting_bottom = false;
        var img_data;
        if (side == "left") {
            start_x = location.x - offset;
            start_y = location.y + dimensions.height / 2;
            img_data = ctx.getImageData(start_x, start_y, width, height);
            var left_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            left_color = "#" + left_color;
            hitting_left = (left_color == this.level.mazeColor);
        } else if (side == "right") {
            start_x = location.x + dimensions.width;
            start_y = location.y + dimensions.height / 2;
            img_data = ctx.getImageData(start_x, start_y, width, height);
            var right_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            right_color = "#" + right_color;
            hitting_right = (right_color == this.level.mazeColor);
        } else if (side == "top") {
            start_x = location.x + dimensions.width / 2;
            start_y = location.y - offset;
            img_data = ctx.getImageData(start_x, start_y, width, height);
            var top_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            top_color = "#" + top_color;
            hitting_top = (top_color == this.level.mazeColor);
        } else if (side == "bottom") {
            start_x = location.x + dimensions.width / 2;
            start_y = location.y + dimensions.height + offset;
            img_data = ctx.getImageData(start_x, start_y, width, height);
            var bottom_color = rgbToHex(img_data.data[0], img_data.data[1], img_data.data[2]);
            bottom_color = "#" + bottom_color;
            hitting_bottom = (bottom_color == this.level.mazeColor);
        }
        return {
            left: hitting_left,
            right: hitting_right,
            bottom: hitting_bottom,
            top: hitting_top
        }
    }
}
