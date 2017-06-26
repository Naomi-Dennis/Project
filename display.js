class Display {
    constructor() {
        this.actors = [];
        this.level = undefined;
        this.total_num_actors = [];
    }
    render() {
        this.level.render();
        myGame.updatePoints();
        var currentActor;
        var actors_to_discard = [];
        for (var i in this.actors) {
            currentActor = this.actors[i];
            if (currentActor.onStage) {
                this.actors[i].detectCollision();
                this.actors[i].render();
            } else {
                actors_to_discard.push(currentActor);
            }
        }

    }
    refresh() {
        this.clear();
        this.render();
    }
    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }
    addActor(newActor) {
        newActor.id = this.total_num_actors;
        this.total_num_actors++;
        this.actors.push(newActor);
    }
    clearAllActors() {
        this.clear();
        this.actors = [];
    }
    removeActor(actor_to_remove) {
        var index = undefined;
        var currentActor;
        for (var i in this.actors) {
            currentActor = this.actors[i];
            if (currentActor.id == actor_to_remove.id) {
                index = currentActor.id;
                break;
            }
            console.log("ERROR: ACTOR NOT FOUND!")
        }
        this.actors.splice(index, 1);

    }
    setLevel(newLevel) {
        this.level = newLevel;
    }
}
