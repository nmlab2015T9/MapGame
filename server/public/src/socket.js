var socket = io();
mapSizeX = 600;
mapSizeY = 600;
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
            map2D[x][y] = mapArray.map[x*mapSizeX + y];
        }
    }
    //console.log(mapArray.map);
});

socket.on('gameState', function(gs) {
    gameState = gs.gameState;
});

function sendFrame(x, y, mius) {
    socket.emit('frame', {
        'loc': [x, y]
    });
}