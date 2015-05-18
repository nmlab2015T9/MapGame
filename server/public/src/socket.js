var socket = io();
mapSizeX = 640;
mapSizeY = 640;
myX = 0;
myY = 0;
gameState = 'unknown';
map2D = new Array(mapSizeX);
centerLat = 0;
centerLng = 0;
otherPlayerData = {};

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
    myX = shiftX + mapArray.birthX -14;
    myY = shiftY + mapArray.birthY -31;
    centerLat = mapArray.lat;
    centerLng = mapArray.lng;
    console.log('mapArrayCome!!!!');
    mapArrayCome();
});

socket.on('gameState', function(gs) {
    gameState = gs.gameState;
    stateCome();
});

socket.on('FB_In', function(fb) {
    otherPlayerData[fb.fbId] = { x: myX, y: myY, score: 0 };
    if(gameState == 'stop' || gameState == 'one') {
        createOtherPlayer(fb.clientId, fb.fbId, fb.loc[0], fb.loc[1]);
        newOtherScore(fb.clientId, fb.fbId);
    }
});

socket.on('Ceremony', function(firstPlace){
    console.log('setting ceremony screen');
    setCeremonyScreen(firstPlace.clientId, firstPlace.fbId);
});

function sendGetOtherPlayer() {
    socket.emit('getOtherPlayer', { 'fbId': ID });
}

socket.on('FB_Out', function(fb) {
    if(fb.fbId in otherPlayerData) {
        delete otherPlayerData[fb.clientId];
        destroyOtherPlayer(fb.clientId);
    }
});

function sendFrame(x, y) {
    socket.emit('frame', {
        'loc': [x, y],
        'score': myPoint
    });
}
function sendCenter(x, y) {
    socket.emit('center', {
        'lat': x,
        'lng': y
    });
}

socket.on('startGame', function(data) {
    gameState = 'start';
});

socket.on('endGame', function(data) {
    setEndGame();
});


socket.on('update', function(data) {
    // if(gameState == 'start') //TODO
    var arrayLength = data.id.length;
    //console.log(arrayLength);
    setTime(data.lobTime);
    for(var i = 0; i < arrayLength; i++) {
        var id = data.id[i].toString();
        //console.log(data['id']);

        if(data[id] != undefined && data[id].canPlay == 'yes') {
            if(otherPlayerHead[id] != undefined) {
                //console.log('other player move');
                otherPlayerHead[id].attr({
                    x: data[id].loc[0] + shiftX,
                    y: data[id].loc[1] + shiftY
                });
                updateOtherScore(id, data[id].score);
            }
        }
    }
});

socket.on('mushroom', function(mush) {
    //console.log('S - > C : mushroom (spawn)' + mush.id);
    placeMushroom(mush.type, mush.id, mush.x, mush.y);
});

function eatenMush(idd, ttt) {
    console.log('C - > S : eaten = '+ idd);
    socket.emit('eaten', { id: idd, type: ttt});
}

socket.on('destroyMush', function(data) {
    console.log('S - > C : destroyMush');
    mushrooms[data.id].destroy();
});