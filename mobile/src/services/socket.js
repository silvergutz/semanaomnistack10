import socketio from 'socket.io-client';

const socket = socketio('http://192.168.5.11:3333', {
    autoConnect: false,
});

function connect(latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs
    };

    socket.connect();

    // socket.on('message', console.log);
    // socket.on('params', console.log);
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect;
    }
}

function subscribeToNewDevs(subscribeFunction) {
    socket.on('devCreated', subscribeFunction);
}

export {
    connect,
    disconnect,
    subscribeToNewDevs,
};