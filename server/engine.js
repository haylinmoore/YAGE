const exports = module.exports = {};

/* Functions */

//Homegrown square collision, with options to move out of colider
export function colCheck(shapeA, shapeB, move) {
    // get the vectors to check against
    const vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));

    const vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));

    const // add the half widths and half heights of the objects
    hWidths = (shapeA.width / 2) + (shapeB.width / 2);

    const hHeights = (shapeA.height / 2) + (shapeB.height / 2);
    let colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                if (move.includes("t")) {
                    shapeA.y += oY;
                }
            } else {
                colDir = "b";
                if (move.includes("b")) {
                    shapeA.y -= oY;
                }
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                if (move.includes("l")) {
                    shapeA.x += oX;
                }
            } else {
                colDir = "r";
                if (move.includes("r")) {
                    shapeA.x -= oX;
                }
            }
        }
    }
    return {
        hit: colDir,
        intercect: [oX, oY]
    };
}

/* Classes */

export var classes = {};

exports.classes.rectangle = function (position, size, movement, settings) {

    if (settings == undefined) {
        settings = {};
    }

    this.settings = {
        visibility: settings.visibility | true,
    };

    this.x = position[0];

    this.y = position[1];

    this.width = size[0];

    this.height = size[1];

    this.movement = movement;

    if (this.movement == "dynamic") {
        this.motion = {
            xm: 0,
            ym: 0
        };
    }

    return this;
};

exports.classes.player = (uuid, position, settings, color) => {

    const self = {};

    if (settings == undefined) {
        settings = {};
    }

    self.pressingRight = false;

    self.color = color;

    self.pressingLeft = false;

    self.pressingUp = false;

    self.pressingDown = false;

    self.uuid = uuid;

    self.speed = 0.5;

    self.settings = {
        visibility: settings.visibility | true,
    };

    self.x = position[0];

    self.y = position[1];

    self.width = 40;

    self.height = 40;

    self.movement = "dynamic";

    self.motion = {
        xm: 0,
        ym: 0
    };

    self.renderType = "player";

    self.key = (key, state) => {
        switch (key) {
            case 68:
            case 39:
                self.pressingRight = state;
                break;
            case 65:
            case 37:
                self.pressingLeft = state;
                break;
            case 87:
            case 38:
            case 32:
                self.pressingUp = state;
                break;
            case 83:
            case 40:
                self.pressingDown = state;
                break;

        }
    };

    self.physics = () => {

        if (self.pressingRight) {
            self.motion.xm += self.speed;
        }
        if (self.pressingLeft) {
            self.motion.xm -= self.speed;
        }

        if (self.pressingUp) {
            self.motion.ym -= self.speed;
        }
        if (self.pressingDown) {
            self.motion.ym += self.speed;
        }

        self.x += self.motion.xm;
        self.y += self.motion.ym;

        self.motion.xm *= exports.world.consts.friction;
        self.motion.ym *= exports.world.consts.friction;

        let check;

        for (var ii in exports.world.bodies.static) {
            check = exports.colCheck(self, exports.world.bodies.static[ii], "tblr");

            if (check.hit == "b") {
                self.grounded = true;
                if (self.motion.ym > 0) {
                    self.motion.ym = 0;
                }
            }
        }

        for (ii in exports.world.bodies.dynamic) {
            if (ii == self.uuid) {
                continue;
            }
            check = exports.colCheck(exports.world.bodies.dynamic[ii], self, "tblr");

            if (check.hit != null) {
                exports.world.bodies.dynamic[ii].motion.xm = self.motion.xm * 4;
                exports.world.bodies.dynamic[ii].motion.ym = self.motion.ym * 4;
            }

        }
    };

    return self;
};


/* Physics */

export var world = {
    bodies: {
        static: [],
        dynamic: {},
    },
    height: 500,
    width: 500,
    consts: {
        gravity: 1,
        friction: 0.9
    }
};

//Test dynamic

// Physics Loop

export function startWorld() {
    setInterval(() => {
        for (const i in exports.world.bodies.dynamic) {
            const body = exports.world.bodies.dynamic[i];
            body.physics();
            if (body.x < 10 || body.x > exports.world.width - 50 || body.y < 10 || body.y > exports.world.height - 50) {
                body.x = 250;
                body.y = 250;
                body.motion.xm = 0;
                body.motion.ym = 0;
            }
        }
    }, 1000 / 60);
}