var canvas;
var ctx;
$(document).ready(beginScript);

function beginScript() {
    canvas = $("#mazeCanvas")[0];
    ctx = canvas.getContext("2d");

    var myGame = new Game();


    // $("#newMazeBtn").click(this.reDrawMaze.bind(this));
}
