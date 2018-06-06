require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"engine":[function(require,module,exports){
var exports = module.exports = {};

/* Functions */

//UUID system compatible with RFC4122
exports.uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

//Homegrown square collision, with options to move out of colider
exports.colCheck = function(shapeA, shapeB, move) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

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
};

/* Classes */

exports.classes = {};

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

exports.classes.player = function (uuid, position, settings, color) {

    var self = {};

    if (settings == undefined) {
        settings = {};
    }

    self.pressingRight = false;

    self.color = color;

    self.pressingLeft = false;

    self.pressingUp = false;

    self.pressingDown = false;

    self.uuid = uuid;

    self.speed = 0.2;

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

    self.key = function (key, state) {
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

    self.physics = function () {

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

        self.motion.xm *= world.consts.friction;
        self.motion.ym *= world.consts.friction;

        var check;

        for (var ii in world.bodies.static) {
            check = exports.colCheck(self, world.bodies.static[ii], "tblr");

            if (check.hit == "b") {
                self.grounded = true;
                if (self.motion.ym > 0) {
                    self.motion.ym = 0;
                }
            }
        }

        for (ii in world.bodies.dynamic) {
            if (ii == self.uuid) {
                continue;
            }
            check = exports.colCheck(world.bodies.dynamic[ii], self, "tblr");

            if (check.hit != null) {
                world.bodies.dynamic[ii].motion.xm = self.motion.xm * 4;
                world.bodies.dynamic[ii].motion.ym = self.motion.ym * 4;
            }

        }
    };

    return self;
};


/* Physics */

exports.world = {
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

exports.startWorld = function(){
    setInterval(function () {
        for (var i in world.bodies.dynamic) {
            var body = world.bodies.dynamic[i];
            body.physics();
            if (body.x < 10 || body.x > world.width - 50 || body.y < 10 || body.y > world.height - 50) {
                body.x = 250;
                body.y = 250;
                body.motion.xm=0;
                body.motion.ym=0;
            }
        }
    }, 1000 / 60);
};


},{}]},{},[]);
