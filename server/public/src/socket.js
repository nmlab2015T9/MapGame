var socket = io();

/*socket.emit('client', {
    'id': Facebook_Id
});*/

socket.on('mapArray', function(mapArray) {
    mapArray.map.forEach()
});

function sendToServer() {
    socket.emit('frame', {
        'loc': [0, 0],
        'bullet': [0, 0]
    })
}