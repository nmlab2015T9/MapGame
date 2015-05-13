Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  60,
    height: 60,
    tile: {
      width:  10,
      height: 10
    }
  },
 
  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },
 
  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },
 
  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(600,600);
    Crafty.background('none');

    // Player character, placed at 5, 5 on our grid
    Crafty.e('PlayerCharacter').at(35, 20);

    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
      for (var y = 0; y < Game.map_grid.height; y++) {
        var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

        if (at_edge) {
          // Place a tree entity at the current tile
          Crafty.e('Boarder').at(x, y);
        } else if (getRGB(x, y)[0]>=200 && getRGB(x, y)[1]>=200 && getRGB(x, y)[2]>=200) {
          // Place a bush entity at the current tile
          //Crafty.e('Buildings').at(x, y);
          console.log('!!!');
        }
        else {
          console.log(x + " " + y + " false");
        }*/
      }
    }
  }
}