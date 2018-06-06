// esversion:6
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require("../client/engine.js");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var SOCKET_LIST = {};

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.id = null;

    socket.on('hello', function (id) {
        console.log(id);
        socket.id = id;
        world.bodies.dynamic[id] = new classes.player(id, [250, 250], {}, "red");
        socket.broadcast.emit('welcome', {
            id: id
        });

        for (var i in world.bodies.dynamic) {
            let player = world.bodies.dynamic[id];
            socket.emit('update', [id, player.x, player.y, player.motion.xm, player.motion.ym, new Date().getTime()]);
        }

        SOCKET_LIST[socket.id] = socket;
    });
    socket.on('disconnect', function (data) {
        console.log('Disconnected');
        socket.broadcast.emit('disconnected', socket.id);
        delete world.bodies.dynamic[socket.id];
        delete SOCKET_LIST[socket.id];
    });
    socket.on('myCord', function (data) {
        let player = world.bodies.dynamic[socket.id];
        console.log(player.x, data[0], player.y, data[1]);
        let distance = Math.hypot(data[0] - player.x, data[1] - player.y);

        if (distance < 100) {
            world.bodies.dynamic[socket.id].x = data[0];
            world.bodies.dynamic[socket.id].y = data[1];
        } else {
            console.log(distance);
            io.sockets.emit('update', [socket.id, player.x, player.y, player.motion.xm, player.motion.ym, new Date().getTime()]);
        }

    });
    socket.on('move', function (data) {
        world.bodies.dynamic[socket.id].key(data.key, data.state);
        socket.broadcast.emit('move', {
            id: socket.id,
            key: data.key,
            state: data.state
        });
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

console.log(world);

setInterval(function () {

    for (let id in world.bodies.dynamic) {
        let player = world.bodies.dynamic[id];
        io.sockets.emit('update', [id, player.x, player.y, player.motion.xm, player.motion.ym, new Date().getTime()]);
    }
}, 1000/60);