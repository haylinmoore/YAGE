// esversion:6
var WebSocket = require('ws');
var engine = require("./engine.js");
var classes = engine.classes;
var world = engine.world;

engine.startWorld();

var SOCKET_LIST = {};

var currentId = 0;


const wss = new WebSocket.Server({
    port: 8082
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function connection(ws) {
    ws.id = currentId;

    currentId++;

    SOCKET_LIST[ws.id] = ws;

    world.bodies.dynamic[ws.id] = new classes.player(ws.id, [250, 250], {}, "red");

    // This tells the player any data they need on join
    // TODO: Add all data pack

    ws.send(JSON.stringify([1, ws.id]));

    for (var i in world.bodies.dynamic) {
        var message = [4];
        ws.send(JSON.stringify(message.concat(playerPack(i))));
    }

    ws.on('close', function close() {
        delete world.bodies.dynamic[ws.id];
        wss.broadcast(JSON.stringify([0, ws.id]));
    });

    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        switch (message[0]) {
            case 2:
                // For if a player presses a key

                world.bodies.dynamic[ws.id].key(message[1], message[2]);

                // Echo that keypress to everyone else
                wss.broadcast(JSON.stringify([3, ws.id, message[1], message[2]]));
                break;
        }

    });
});

var playerPack = function (userID) {
    //[userID (Int), X-Cord (Int), Y-Cord (Int), X-Mom (Int), Y-Mom(Int)]
    var player = world.bodies.dynamic[userID];
    return [userID, Math.round(player.x), Math.round(player.y), roundUp(player.motion.xm, 10), roundUp(player.motion.ym, 10)];
};

function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}

setInterval(function () {

    // Update the positions of everyone.

    for (var i in world.bodies.dynamic) {
        var message = [4];
        wss.broadcast(JSON.stringify(message.concat(playerPack(i))));
    }
}, 1000/5);