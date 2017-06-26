var canvas;
var ctx;
var points = 0;
var myGame;
$(document).ready(beginScript);

function beginScript() {
    canvas = $("#mazeCanvas")[0];
    ctx = canvas.getContext("2d");

    myGame = new Game();
    myGame.start();
    /*
        $('#mazeCanvas').mousemove(function (e) {
            var pos = findPos(this);
            var x = e.pageX - pos.x;
            var y = e.pageY - pos.y;
            var coord = "x=" + x + ", y=" + y;
            var c = ctx;
            var p = c.getImageData(x, y, 1, 1).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            console.log(coord + "  " + hex);
        });
        */

    // $("#newMazeBtn").click(this.reDrawMaze.bind(this));
}

function genRandom(array) {
    var length = array.length;
    var index = Math.round(Math.random() * (length - 1)) + 1
    return array[index - 1];
}

function findPos(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            x: curleft,
            y: curtop
        };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}


// set up some square
