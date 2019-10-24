const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let userIds = 0;

io.on('connection', (socket) => {
    const userId = ++userIds;

    socket.join(`room ${userId}`);

    console.log(`user ${userId} connected`);

    socket.emit('chat message', `Welcome user ${userId}!`);

    socket.on('disconnect', function(){
        console.log(`user ${userId} disconnected`);
    });

    socket.on('chat message', function(msg){
        const match = /^([0-9]+):(.*)/.exec(msg);

        if(match && match.length > 1) {
            console.log(`private chat message for ${match[1]}: ${match[2]}`);
            io.to(`room ${match[1]}`).emit('chat message', `private message: ${match[2]}`)
        } else {
            console.log(`chat message from ${userId}: ` + msg);
            io.emit('chat message', `${userId}: ${msg}`);
        }
    });

    socket.broadcast.emit('hi');
});

io.emit('some event', { for: 'everyone' });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
   console.log('listening to 3000...')
});

