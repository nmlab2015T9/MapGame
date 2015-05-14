var socket = io();
mapSizeX = 640;
mapSizeY = 640;
gameState = 'unknown';
map2D = new Array(mapSizeX);
for (var i = 0; i < mapSizeX; ++i) {
    map2D[i] = new Array(mapSizeY);
}
function sendFBID(id) {
    socket.emit('fb', {
        'id': id
    });
}

socket.on('mapArray', function(mapArray) {
    for(var x = 0; x != mapSizeX; ++x) {
        for(var y = 0; y != mapSizeY; ++y) {
            map2D[x][y] = mapArray.map[y*mapSizeX + x];
        }
    }
    console.log('mapArrayCome!!!!');
    mapArrayCome();
});

socket.on('gameState', function(gs) {
    gameState = gs.gameState;
    stateCome();
});

function sendFrame(x, y) {
    socket.emit('frame', {
        'loc': [x, y]
    });
}
function sendCenter(x, y) {
    socket.emit('center', {
        'lat': x,
        'lng': y
    });
}