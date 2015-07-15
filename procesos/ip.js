var io = require('socket.io')

function verIP() {
    io.sockets.on('connection', function(socket) {
        var id = socket.id,
            ip = socket.request.connection.remoteAddress;
        console.log(id);
        console.log(ip);
    })
}
module.exports = verIP()