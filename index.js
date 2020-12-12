var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let connectedUsers = [];
let nowTyping = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('connected', 'Conectado 🌎')
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log(`${msg.nick} diz: ${msg.message}`);
        io.emit('chat message', msg);
    });

    socket.on('nowTyping', (nickname) => {
        if (!nowTyping.some((nick) => nick === nickname)) {
            nowTyping.push(nickname);
        }
        io.emit('typing', nowTyping);
    });

    socket.on('finishTyping', (nickname) => {
        nowTyping = nowTyping.filter((nick) => nick != nickname);
        io.emit('typing', nowTyping);
    });

    socket.on('typing', (msg) => {
        console.log(`${msg.nick} diz: ${msg.message}`);
        io.emit('chat message', msg);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

//ssh -R alexsanderalves:3000:localhost:3000 serveo.net