class Game {
    constructor() {
        this.level = new Maze();
        this.level.init();
        this.player = new Player();
        this.screen = new Display();
        this.screen.addActor(this.level);
        this.screen.addActor(this.player);
        this.screen.render();
        this.playerControls();
    }
    start() {}
    playerControls() {
        $(document).keypress(this.playerControlHandle(this.player, this.screen));
    }
    playerControlHandle(player, screen) {
        return function (event) {
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
