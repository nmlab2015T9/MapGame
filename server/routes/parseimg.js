

    var fs = require('fs'),
    request = require('request');
module.exports = {


 parseMap: function() {
        var theMapArray = new Array(640);
        for (var i = 0; i < 640; i++) {
            theMapArray[i] = new Array(640);

        }
        var download = function (uri, filename, callback) {
            request.head(uri, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };
    download('http://maps.googleapis.com/maps/api/staticmap?center=25.0159,121.5392&zoom=19&size=640x640&sensor=false&style=feature:all%7Celement:all%7Chue:0xff0000%7Csaturation:100&style=feature:road%7Celement:geometry%7Chue:0x66f934%7Clightness:100&style=feature:water%7Celement:geometry%7Ccolor:0xbbbbff&style=feature:all%7Celement:labels%7Cvisibility:off&style=feature:road%7Celement:labels%7Cvisibility:off',
        'google.png', function() { console.log('done download!!'); });
    var img = document.createElement('img');
    img.src = "google.png";
    var canvas = $('<canvas/>')[0];
    canvas.width = 640;
    canvas.height = 640;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    for (var x = 0; x < 640; x++) {
        for (var y = 0; y < 640; y++) {
            var data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
            if (data[0] == 255 && data[1] == 255 && data[2] == 255) theMapArray[x][y] = 0;
            else if (data[0] == 187 && data[1] == 187 && data[2] == 255) theMapArray[x][y] = 3;
            else theMapArray[x][y] = -1;
        }
    }
    return theMapArray;
}

}