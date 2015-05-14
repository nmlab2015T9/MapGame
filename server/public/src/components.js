// The Grid component allows an element to be located
//  on a grid of tiles
shiftX = Math.round(window.innerWidth/2-320), shiftY = Math.round(window.innerHeight/2-320) ;
lastX = 0;
lastY = 0;
nowTime = undefined

Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height,
	  z: 1
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
    this.requires('2D, DOM, Grid');
  }
});
 
// A Tree is just an Actor with a certain color
Crafty.c('Boundary', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('red');
  }
});

Crafty.c('Buildings', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 185, 40)');
  }
});

Crafty.c('Head', {
  init: function() {
    this.requires('2D, DOM, Color, Image')
		.attr({
		w: 50,
		h: 50,
		x: myX - 13,
		y: myY - 38,
		z: 100
    });
  }
});

Crafty.c('OtherPlayer', {
  init: function() {
    this.requires('Actor, spr_player, SpriteAnimation')
        /*.animate('OtherPlayerMovingUp',    7, 1, 0)
        .animate('OtherPlayerMovingRight', 7, 3, 0)
        .animate('OtherPlayerMovingDown',  7, 6, 0)
        .animate('OtherPlayerMovingLeft',  7, 4, 0)*/;
  }
});

Crafty.c('PlayerPosition',{
 init: function() {
    this.requires('Actor, Fourway, Color, Collision')
		.color('rgb(20, 185, 40)')
		.attr({
			x: myX + 14,
			y: myY + 31
		})
		.fourway(2)
		.stopOnSolids()
        .bind('EnterFrame', function() {
          if(lastX != this.x || lastY != this.y) {
            sendFrame(this.x - shiftX -27, this.y -shiftY -69);
          }
          lastX = this.x;
          lastY = this.y;
        });
	},
	
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
	
	// Respond to this player visiting a village
	visitVillage: function(data) {
		villlage = data[0].obj;
		villlage.visit();
	} 
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
	init: function() {
    this.requires('Actor, spr_player, SpriteAnimation')
      .animate('PlayerMovingUp',    7, 1, 0)
      .animate('PlayerMovingRight', 7, 3, 0)
      .animate('PlayerMovingDown',  7, 6, 0)
      .animate('PlayerMovingLeft',  7, 4, 0);

      /*var animation_speed = 1;
      this.bind('NewDirection', function(data) {
      if (data.x > 0) {
        this.animate('PlayerMovingRight', animation_speed, -1);
      } else if (data.x < 0) {
        this.animate('PlayerMovingLeft', animation_speed, -1);
      } else if (data.y > 0) {
        this.animate('PlayerMovingDown', animation_speed, -1);
      } else if (data.y < 0) {
        this.animate('PlayerMovingUp', animation_speed, -1);
      } else {
        this.stop();
      }
    });*/
  }
});
otherPlayerHead = {};
otherPlayerBody = {};
function createOtherPlayer(clientId, fbid, x, y) {
  console.log('creating other player: '+ clientId + ', fb = ' + fbid);
  var other = document.createElement('img');
  other.id='other'+clientId;
  other.setAttribute("src", "http://graph.facebook.com/" + fbid + "/picture?type=normal");
  other.setAttribute("style", "width:50px;height:50px;border-radius: 50%");
  var proimg = document.getElementById('profileImage');
  var crstage = document.getElementById('cr-stage');
  crstage.insertBefore(other, proimg);
  otherPlayerHead[clientId] = Crafty.e('Head').DOM(other).attr({x: x + shiftX -13, y: y + shiftY -38 });
  otherPlayerBody[clientId] = Crafty.e('OtherPlayer').at(x + shiftX, y + shiftY);
  otherPlayerHead[clientId].attach(otherPlayerBody[clientId]);
}

function destroyOtherPlayer(clientId) {
  console.log('destroy player: '+ clientId);
  document.getElementById('other'+clientId).remove();
  if(otherPlayerHead[clientId] != undefined)
      otherPlayerHead[clientId].destroy();
  delete otherPlayerHead[clientId];
  delete otherPlayerBody[clientId];
}

function setTime(time) {
  //console.log(time);
  if(nowTime != undefined)
    nowTime.text(time);
}

Crafty.scene('Game', function() {
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    } 
  }

  for (var x = 0; x < 640; x++){
	  for (var y = 0; y < 640; y++){
        if (map2D[x][y] >1) {
          Crafty.e('Buildings').attr({
            x: x + shiftX,
            y: y + shiftY,
            w: map2D[x][y],
            h: map2D[x][y]
          });
        }
	  }
  }

  document.getElementById("titleAndLogIn").style.display = "none";
  document.getElementById("map_canvas").setAttribute("style","-webkit-filter:blur(0px)");
  document.getElementById("cr-stage").style.display = "inherit";
  document.getElementById("profileImage").style.display = "inherit";
  document.getElementById("positionChooser").style.display = "none";
  marker.setVisible(false);
  sendGetOtherPlayer();

  nowTime = Crafty.e('2D, Canvas, Text')
      .textFont({size:'120px', weight: 'bold' })
      .attr({ x: shiftX + 655, y: 150 });


  // Player character, placed at 5, 5 on our grid
  var animation_speed = 1;
  this.playerPosition = Crafty.e('PlayerPosition').bind('NewDirection', function(data) {
		if (data.x > 0) {
			player.animate('PlayerMovingRight', animation_speed, -1);
		} else if (data.x < 0) {
			player.animate('PlayerMovingLeft', animation_speed, -1);
		} else if (data.y > 0) {
			player.animate('PlayerMovingDown', animation_speed, -1);
		} else if (data.y < 0) {
			player.animate('PlayerMovingUp', animation_speed, -1);
		} else {
			player.stop();
		}
    });
  this.player = player = Crafty.e('PlayerCharacter').at(myX, myY);
  this.head = Crafty.e('Head').DOM(document.getElementById("profileImage"));
  this.playerPosition.attach(this.player);
  this.playerPosition.attach(this.head);
  
  this.occupied[this.player.at().x][this.player.at().y] = true;

  // Place a tree at every edge square on our grid of 16x16 tiles
  /*for (var x = Game.map_grid.width - 641; x < Game.map_grid.width; x++) {
    for (var y = Game.map_grid.height - 641; y < Game.map_grid.height; y++) {
      var at_edge = x ==  Game.map_grid.width - 641 || x == Game.map_grid.width - 1 || y == Game.map_grid.height - 641 || y == Game.map_grid.height - 1;

      if (at_edge) {
        // Place a tree entity at the current tile
        Crafty.e('Tree').at(x , y);
        this.occupied[x][y] = true;
      } else if (Math.random() < 0.0001 && !this.occupied[x][y]) {
        // Place a bush entity at the current tile
        Crafty.e('Bush').attr({
	  x: x + shiftX,
	  y: y + shiftY
    });
        this.occupied[x][y] = true;
      }
    }
  }*/
   Crafty.e('Boundary').attr({
						x: shiftX-5,
						y: shiftY-5,
						w: 650,
						h: 5
					});
   Crafty.e('Boundary').attr({
						x: shiftX-5,
						y: shiftY-5,
						w: 5,
						h: 650
					});
   Crafty.e('Boundary').attr({
						x: shiftX,
						y: shiftY+640,
						w: 645,
						h: 5
					});
   Crafty.e('Boundary').attr({
						x: shiftX+640,
						y: shiftY,
						w: 5,
						h: 645
					});




  // Generate up to five villages on the map in random locations
  /*var max_villages = 5;
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      if (Math.random() < 0.02) {
        if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
          Crafty.e('Village').at(x, y);
        }
      }
    }
  }*/

  // Show the victory screen once all villages are visisted
  /*this.show_victory = this.bind('VillageVisited', function() {
    if (!Crafty('Village').length) {
      Crafty.scene('Victory');
    }
  });*/
}/*, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('VillageVisited', this.show_victory);
}*/);


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
/*Crafty.scene('Victory', function() {
  // Display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Victory!');

  // Watch for the player to press a key, then restart the game
  //  when a key is pressed
  this.restart_game = this.bind('KeyDown', function() {
    Crafty.scene('Game');
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});*/

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Load our sprite map image
  Crafty.load(['assets/character.png','http://desolate-caverns-4829.herokuapp.com/assets/16x16_forest_1.gif'], function(){
    // Once the images are loaded...

    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(16, 'http://desolate-caverns-4829.herokuapp.com/assets/16x16_forest_1.gif', {
      spr_tree:    [0, 0],
      spr_bush:    [1, 0]
      //spr_village: [0, 1]
    });

    // Define the PC's sprite to be the first sprite in the third row of the
    //  animation sprite map
    Crafty.sprite(28,31, 'assets/character.png', {
      spr_player:  [0, 7]
    }, 0, 1);

   

    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
      .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
      .text('Loading...');

    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  })
});

/*Crafty.c('CustomControls', {
  _loc: {lat: 25.0159, lng: 121.5392},
  __move: {left: false, right: false, up: false, down: false},    
  _speed: 0.005,



    this.bind('EnterFrame', function() {
      // Move the player in a direction depending on the booleans
      // Only move the player in one direction at a time (up/down/left/right)
      if (move.right) this._loc.lng += this._speed;
      if (move.left) this._loc.lng -= 	this._speed;
      if (move.up) this._loc.lat += this._speed;
      if (move.down) this._loc.lat -= this._speed;
      //panMap(this._loc);
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