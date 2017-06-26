class Actor {
    constructor() {
        this.id = 0;
        this.size = 0;
        this.x = 0;
        this.y = 0;
        this.width = this.size;
        this.height = this.size;
        this.speed = 0;
        this.onStage = true;
        this.boundingBox = new BoundingBox(this, null)
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
        this.boundingBox.checkColorCollision()
    }
    addToStage() {
        this.onStage = true;
    }
    removeFromStage() {
        this.onStage = false;
    }
};
class Player extends Actor {
    constructor() {
        super();
        this.size = 10;
        this.width = this.size;
        this.height = this.size;
        this.x = 20;
        this.y = 20;
        this.speed = 2;
        this.onStage = true;
        this.ammo = 10;
        this.fireAmmo = 10;
        this.iceAmmo = 10;
        this.windAmmo = 10;
        this.direction = "right";
        this.currentAmmoType = "normal";
        this.boundingBox = new BoundingBox(this, null)
    }
    gainAmmo(ammoType, ammoAmt) {
        if (ammoType == "normal") {
            this.ammo += ammoAmt;
        } else if (ammoType == "ice") {
            this.iceAmmo += ammoAmt;
        } else if (ammoType == "wind") {
            this.windAmmo += ammoAmt;
        } else if (ammotType == "fire") {
            this.fireAmmo += ammoAmt;
        }
    }
    switchTo(bulletType) {
        if (bulletType == "normal") {
            if (this.ammo > 0) {
                this.currentAmmoType = bulletType
                return true;
            }
        } else if (bulletType == "fire") {
            if (this.fireAmmo > 0) {
                this.currentAmmoType = bulletType
                return true;
            }
        } else if (bulletType == "wind") {
            if (this.windAmmo > 0) {
                this.currentAmmoType = bulletType
                return true;
            }
        } else if (bulletType == "ice") {
            if (this.iceAmmo > 0) {
                this.currentAmmoType = bulletType
                return true;
            }
        }
        return false;
    }
    fireBullet() {
        var newBullet = new Bullet();
        newBullet.x = this.x + this.size / 2;
        newBullet.y = this.y + this.size / 2;
        var cartridge = 0;
        if (this.currentAmmoType == "normal") {
            cartridge = this.ammo;
            this.ammo--;
        } else if (this.currentAmmoType == "fire") {
            cartridge = this.fireAmmo;
            this.fireAmmo--;
        } else if (this.currentAmmoType == "wind") {
            cartridge = this.windAmmo;
            this.windAmmo--;
        } else if (this.currentAmmoType == "ice") {
            cartridge = this.iceAmmo;
            this.iceAmmo--;
        }
        newBullet.fire(this.currentAmmoType, this.direction, cartridge)
    }
    detectCollision() {
        this.boundingBox.detectWallCollision();
        this.boundingBox.checkColorCollision()
    }
}
class EndingPoint extends Actor {
    constructor() {
        super();
        this.size = 15;
        this.width = this.size;
        this.height = this.size / 2;
        this.boundingBox.collideWithColor("#ffffff", this.loadNextLevel.bind(this));
    }
    render() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = "#7c4a22"
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fill();
        ctx.moveTo(this.x, this.y)
        ctx.strokeStyle = "#0000aa"
        ctx.stroke();
        ctx.closePath();
    }
    loadNextLevel() {
        if (myGame.level.maxPellets == points / myGame.currentLevel) {
            myGame.gotoNextLevel();
        }
    }
}
class Bullet extends Actor {
    constructor() {
        super();
        this.size = 5;
        this.speed = 3;
        this.bulletTypes = {
            NORMAL: "normal",
            FIRE: "fire",
            ICE: "ice",
            WIND: "wind"
        };
        this.width = this.size;
        this.height = this.height;
        this.type = "";
        this.power = 1;
        this.area = Math.PI * this.size;
    }
    fire(type, direction, number_fired) {
        myGame.screen.addActor(this)
        type = type.toUpperCase();
        this.render();
        var initial_position = {
            x: this.x,
            y: this.y
        };
        this.type = this.bulletTypes[type];
        direction = direction.toLowerCase();
        var id = type + "_" + number_fired.toString();
        var event_name = "moveBullet_" + id;
        myGame.addEvent("moveBullet_" + id, this.trajectory(event_name, direction, initial_position).bind(this));
        myGame.addEvent("interactBullet_" + id, this.killThingsOnLevel.bind(this));

    }
    killThingsOnLevel() {
        var currentTrap;
        for (var i in traps) {
            currentTrap = traps[i];
            if (currentTrap.onStage) {
                if (this.type == this.bulletTypes["NORMAL"]) {
                    this.boundingBox.collideWithColor(myGame.normalColor, this.testHit.bind(this), currentTrap);
                } else if (this.type == this.bulletTypes["FIRE"]) {
                    this.boundingBox.collideWithColor(myGame.iceColor, this.testHit.bind(this), currentTrap);
                    this.boundingBox.collideWithColor(myGame.normalColor, this.testHit.bind(this), currentTrap);
                }
                if (this.type == this.bulletTypes["ICE"]) {
                    this.boundingBox.collideWithColor(myGame.fireColor, this.testHit, currentTrap);
                    this.boundingBox.collideWithColor(myGame.normalColor, this.testHit, currentTrap);
                }
                if (this.type == this.bulletTypes["WIND"]) {
                    this.boundingBox.collideWithColor(myGame.normalColor, this.testHit.bind(this), currentTrap);
                }
            }
        }
    }
    testHit() {
        this.bounding.mob.removeFromStage();
        this.target.removeFromStage();
    }
    trajectory(event_name, direction, initial_position) {
        return function () {
            var x_unit = Math.pow(this.x - initial_position.x, 2);
            var y_unit = Math.pow(this.y - initial_position.y, 2);
            var distance = Math.sqrt(x_unit + y_unit);
            if (distance < 100) {
                if (direction == "left") {
                    this.x -= this.speed;
                } else if (direction == "right") {
                    this.x += this.speed;
                } else if (direction == "down") {
                    this.y += this.speed;
                } else if (direction == "up") {
                    this.y -= this.speed;
                }
            } else {
                myGame.removeEvent(event_name)
                this.removeFromStage();
            }
        }
    }
    render() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        var color = 0;
        if (this.type == "normal") {
            color = 'rgb(119, 119, 119)'
        } else if (this.type == "fire") {
            color = 'rgb(196, 96, 25)'
        } else if (this.type == "wind") {
            color = 'rgb(239, 241, 242)'
        } else if (this.type == "ice") {
            color = '#0003ed'
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fill()
        ctx.stroke();
        ctx.closePath();
    }
}
class Pellet extends Actor {
    constructor() {
        super();
        this.point = 1;
        this.size = 3; //radius in this case, cuz it's a circle

        this.boundingBox.collideWithColor("#ffffff", this.gainPoint.bind(this));
    }
    render() {
        //This creates a basic circle; don't change it. 
        //Go to w3schools to find more info.
        //https://www.w3schools.com/tags/canvas_arc.asp
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ccb100"
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffdd00"
        ctx.fill()
        ctx.stroke();
        ctx.closePath();


    }
    gainPoint() {
        points++;
        this.removeFromStage();
    }
};

class AmmoCartridge extends Actor {
    constructor(type, player) {
        super();
        this.size = 20;
        this.width = this.size;
        this.height = this.size / 2;
        this.type = type;
        this.player = player;
        this.refillAmount = 20;
    }

    render() {
        //This creates a basic circle; don't change it. 
        //Go to w3schools to find more info.
        //https://www.w3schools.com/tags/canvas_arc.asp
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y)

        var color = 0;
        if (this.type == "normal") {
            color = 'rgb(119, 119, 119)'
        } else if (this.type == "fire") {
            color = '#C'
        } else if (this.type == "wind") {
            color = 'rgb(239, 241, 242)'
        } else if (this.type == "ice") {
            color = 'rgb(0, 3, 237)'
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.size, this.height);
        ctx.fill()
        ctx.stroke();
        ctx.closePath();
    }
}

class ElementTrap extends Actor {
    constructor(type) {
        super();
        this.type = type;
        this.size = 50;
        this.width = this.size;
        this.height = this.size / 2;
        this.area = this.width * this.height;
    }
    render() {
        //This creates a basic circle; don't change it. 
        //Go to w3schools to find more info.
        //https://www.w3schools.com/tags/canvas_arc.asp
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y)
        var color = 0;
        if (this.type == "normal") {
            color = myGame.normalColor;
        } else if (this.type == "fire") {
            color = myGame.fireColor
        } else if (this.type == "wind") {
            color = myGame.windColor
        } else if (this.type == "ice") {
            color = myGame.iceColor
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.size, this.height);
        ctx.fill()
        ctx.stroke();
        ctx.closePath();

    }
}
