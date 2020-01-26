const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
let connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        console.log(socket.id);
        console.log(socket.handshake.query);

        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });

        setTimeout(() => {
            socket.emit('message', 'Hello OmniStack');
            socket.emit('params', JSON.stringify(connections));
        }, 3000);
    });
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter((connection) => {
        console.log('findConnections esta examinando esta conexao: ', connection);
        return calculateDistance(connection.coordinates, coordinates) < 10
            && connection.techs.some(item => techs.includes(item));
    });
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}