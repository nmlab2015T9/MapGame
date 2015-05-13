// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});
 
// A Tree is just an Actor with a certain color
Crafty.c('Buildings', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('blue');
  },
});

Crafty.c('GG', {
  init: function() {
    this.requires('Actor, Color, Solid')
        .color('red');
  },
});

 
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Color, Collision')
      .color('rgb(20, 75, 40)')
      .fourway(3)
      .stopOnSolids()
      .onHit('Bullet', this.gotShot);
  },
 
  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
 
    return this;
  },
 
  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  //
  gotShot: function(who) {

  }
});

Crafty.c('Bullet', {
  init: function() {
    this.requires('Actor, Color, Solid, Collision')
      .color('black')
      .stopOnSolids();
  },

  stopOnSolids: function() {
    this.onHit('Solid', this.destroy);
 
    return this;
  }
});


/*Crafty.c('CustomControls', {
  _loc: {lat: 25.0159, lng: 121.5392},
  __move: {left: false, right: false, up: false, down: false},    
  _speed: 0.005,

  CustomControls: function(speed) {
    if (speed) this._speed = speed;
    var move = this.__move;

    this.bind('EnterFrame', function() {
      // Move the player in a direction depending on the booleans
      // Only move the player in one direction at a time (up/down/left/right)
      if (move.right) this.x += this._speed;
      if (move.left) this.x -= this._speed;
      if (move.up) this.y += this._speed;
      if (move.down) this.y -= this._speed;
    })
    .bind('KeyDown', function(e) {
      // Default movement booleans to false
      //move.right = move.left = move.down = move.up = false;

      // If keys are down, set the direction
      if (e.keyCode === Crafty.keys.D) move.right = true;
      if (e.keyCode === Crafty.keys.A) move.left = true;
      if (e.keyCode === Crafty.keys.W) move.up = true;
      if (e.keyCode === Crafty.keys.S) move.down = true;

      //this.preventTypeaheadFind(e);
    })
    .bind('KeyUp', function(e) {
      // If key is released, stop moving
      if (e.keyCode === Crafty.keys.D) move.right = false;
      if (e.keyCode === Crafty.keys.A) move.left = false;
      if (e.keyCode === Crafty.keys.W) move.up = false;
      if (e.keyCode === Crafty.keys.S) move.down = false;

      //this.preventTypeaheadFind(e);
    });

    return this;
  }
});*/