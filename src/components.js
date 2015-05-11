// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
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
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});
 
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  },
});
 
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, CustomControls, Color, Collision')
      .color('rgb(20, 75, 40)')
      //.stopOnSolids()
      .CustomControls(0.001);
  },
 
  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  /*stopOnSolids: function() {
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
  }*/
});


Crafty.c('CustomControls', {
  _loc: {lat: -34.377, lng: 150.644},
  __move: {left: false, right: false, up: false, down: false},    
  _speed: 0.01,

  CustomControls: function(speed) {
    if (speed) this._speed = speed;
    var move = this.__move;

    this.bind('EnterFrame', function() {
      // Move the player in a direction depending on the booleans
      // Only move the player in one direction at a time (up/down/left/right)
      if (move.right) this._loc.lng += this._speed;
      if (move.left) this._loc.lng -= this._speed;
      if (move.up) this._loc.lat += this._speed;
      if (move.down) this._loc.lat -= this._speed;
      panMap(this._loc);
    })
    .bind('KeyDown', function(e) {
      // Default movement booleans to false
      //move.right = move.left = move.down = move.up = false;

      // If keys are down, set the direction
      if (e.keyCode === Crafty.keys.RIGHT_ARROW) move.right = true;
      if (e.keyCode === Crafty.keys.LEFT_ARROW) move.left = true;
      if (e.keyCode === Crafty.keys.UP_ARROW) move.up = true;
      if (e.keyCode === Crafty.keys.DOWN_ARROW) move.down = true;

      //this.preventTypeaheadFind(e);
    })
    .bind('KeyUp', function(e) {
      // If key is released, stop moving
      if (e.keyCode === Crafty.keys.RIGHT_ARROW) move.right = false;
      if (e.keyCode === Crafty.keys.LEFT_ARROW) move.left = false;
      if (e.keyCode === Crafty.keys.UP_ARROW) move.up = false;
      if (e.keyCode === Crafty.keys.DOWN_ARROW) move.down = false;

      //this.preventTypeaheadFind(e);
    });

    return this;
  }
});