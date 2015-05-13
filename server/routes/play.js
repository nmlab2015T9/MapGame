var express = require('express');
var getPixels = require("get-pixels");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    getPixels("google.png", function(err, pixels) {
        if(err) {
            console.log("Bad image path");
            return
        }
        console.log(pixels.get(0, 0, 0));
    });
    res.render('game.html');
});

module.exports = router;
