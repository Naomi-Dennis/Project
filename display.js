class Display {
    constructor() {
        this.actors = [];
        this.level = undefined;
    }
    render() {
        this.level.render();

        myGame.updatePoints();
        var currentActor;
        for (var i in this.actors) {
            currentActor = this.actors[i];
            if (currentActor.onStage) {
                this.actors[i].detectCollision();
                this.actors[i].render();

            }
        }
        console.log("Actors: " + this.actors.length);
    }
    refresh() {
        this.clear();
        this.render();
    }
    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }
    addActor(newActor) {
        this.actors.push(newActor);
    }
    removeActor(actor_to_remove) {
        var index = this.actors.indexOf(actor_to_remove);
        this.actors.splice(index, 1);
    }
    setLevel(newLevel) {
        this.level = newLevel;
    }
}
