class Display {
    constructor() {
        this.actors = [];
    }
    render() {
        for (var i in this.actors) {
            this.actors[i].render();
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
        this.actors.push(newActor);
    }
    removeActor(actor_to_remove) {
        var index = this.actors.indexOf(actor_to_remove);
        this.actors.splice(index, 1);
    }
}
