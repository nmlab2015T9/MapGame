// The Grid component allows an element to be located
//  on a grid of tiles
shiftX = Math.round(window.innerWidth/2-320), shiftY = Math.round(window.innerHeight/2-320) ;
lastX = 0;
lastY = 0;
nowTime = undefined;
myP = undefined;

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
      //.color('rgb(20, 185, 40)');
      .color('none');
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

myPoint = 0;
Crafty.c('ZMushroom', {
  id: 0,
  init: function() {
    this.requires('Actor, spr_ZMushroom, SpriteAnimation')
        .animate('ZMushroomStanding',  0, 1, 3);
    var animation_speed = 30;
    this.bind('EnterFrame', function(){this.animate('ZMushroomStanding', animation_speed, -1)}
    );
  },
  setId: function(i) {
    this.id = i;
    return this;
  },
  getId: function(i) {
    this.id = i;
    return this;
  },
  // Process a visitation with this village
  visit: function() {
    console.log('z is visited');
    eatenMush(this.id, 'Z');
    this.destroy();
    Crafty.trigger('ZMushroomVisited', this);
  }
});

Crafty.c('GMushroom', {
  id:0,
  init: function() {
    this.requires('Actor, spr_GMushroom, SpriteAnimation')
        .animate('GMushroomStanding',  0, 1, 4);
    var animation_speed = 30;
    this.bind('EnterFrame', function(e){this.animate('GMushroomStanding', animation_speed, -1)}
    );
  },

  // Process a visitation with this village
  visit: function() {
    eatenMush(this.id, 'G');
    this.destroy();
    myPoint++;
    myP.text(myPoint);
    Crafty.trigger('GMushroomVisited', this);
  },
  setId: function(i) {
    this.id = i;
    return this;
  },
  getId: function() {
    return this.id;
  }
});

Crafty.c('SMushroom', {
  id:0,
  init: function() {
    this.requires('Actor, spr_SMushroom, SpriteAnimation')
        .animate('SMushroomStanding',  0, 1, 4);
    var animation_speed = 30;
    this.bind('EnterFrame', function(e){this.animate('SMushroomStanding', animation_speed, -1)}
    );
  },

  // Process a visitation with this village
  visit: function() {
    eatenMush(this.id, 'S');
    myPoint--;
    myP.text(myPoint);
    this.destroy();
    Crafty.trigger('SMushroomVisited', this);
  },
  setId: function(i) {
    this.id = i;
    return this;
  },
  getId: function() {
    return this.id;
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

mySpeed = 1;
Crafty.c('PlayerPosition',{
 init: function() {
    this.requires('Actor, Fourway, Color, Collision')
		.color('rgb(20, 185, 40)')
		.attr({
			x: myX + 14,
			y: myY + 31
		})
		.fourway(mySpeed)
        .onHit('ZMushroom', this.visitZMushroom)
        .onHit('GMushroom', this.visitGMushroom)
        .onHit('SMushroom', this.visitSMushroom)
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

  visitZMushroom: function(data) {
    ZMushroom = data[0].obj;
    mySpeed++;
    this.fourway(mySpeed);
    this.stopOnSolids();
    ZMushroom.visit();
    setTimeout(function() {mySpeed--;
      BOSS.fourway(mySpeed);
      BOSS.stopOnSolids();
      }, 10000);
  } ,
  visitGMushroom: function(data) {
    GMushroom = data[0].obj;
    GMushroom.visit();
  } ,
  visitSMushroom: function(data) {
    SMushroom = data[0].obj;
    SMushroom.visit();
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
    otherPNum--;
    console.log('destroy player: '+ clientId);
    document.getElementById('other'+clientId).remove();
    document.getElementById('score'+clientId).remove();
    otherP[clientId].textFont({size: '0px'});
    if(otherPlayerHead[clientId] != undefined)
        otherPlayerHead[clientId].destroy();
    if(otherP[clientId] != undefined)
        otherP[clientId].destroy();
    if(otherPH[clientId] != undefined)
        otherPH[clientId].destroy();

    delete otherP[clientId];
    delete otherPH[clientId];
    delete otherPlayerHead[clientId];
    delete otherPlayerBody[clientId];
}

otherP = {};
otherPH= {};
otherPNum = 0;
offsets = 60;

function newOtherScore(clientId, fbid){
  otherPNum++;
  var other = document.createElement('img');
  other.id='score'+clientId;
  other.setAttribute("src", "http://graph.facebook.com/" + fbid + "/picture?type=normal");
  other.setAttribute("style", "width:100px;height:100px;border-radius: 50%");
  var proimg = document.getElementById('profileImage');
  var crstage = document.getElementById('cr-stage');
  crstage.insertBefore(other, proimg);
  otherPH[clientId] = Crafty.e('Head').DOM(other).attr({x: shiftX -200, y: shiftY +offsets*otherPNum});
  otherP[clientId] = Crafty.e('2D, DOM, Text')
      .textFont({ size:'50px', weight: 'bold'})
      .attr({ x: shiftX -90, y: shiftY +offsets*otherPNum })
      .text(0);
}

function updateOtherScore(clientId, score){
  otherP[clientId].text(score);
}

function setTime(time) {
  //console.log(time);
  if(nowTime != undefined)
    nowTime.text(time);
}

function setFight() {
  console.log('setFight');
  nowTime.textFont({ size: '0px'});
}

mushrooms = {};

BOSS = undefined;
function placeMushroom(type, id, x, y){
  if(type == 'Z')
    mushrooms[id] = Crafty.e('ZMushroom').at(x + shiftX, y + shiftY).setId(id);
  else if(type == 'G')
    mushrooms[id] = Crafty.e('GMushroom').at(x + shiftX, y + shiftY).setId(id);
  else if(type == 'S')
    mushrooms[id] = Crafty.e('SMushroom').at(x + shiftX, y + shiftY).setId(id);
};

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

  nowTime = Crafty.e('2D, DOM, Text')
      .textFont({size:'120px', weight: 'bold' })
      .attr({ x: shiftX + 655, y: 150 });

  myP = Crafty.e('2D, DOM, Text')
      .textFont({ size:'50px', weight: 'bold'})
      .attr({ x: shiftX-90, y: shiftY})
      .text(myPoint);

  var myPHead = document.createElement('img');
  myPHead.id = 'myphead';
  myPHead.setAttribute("src", "http://graph.facebook.com/" + ID + "/picture?type=normal");
  myPHead.setAttribute("style", "width:100px;height:100px;border-radius: 50%");
  var proimg = document.getElementById('profileImage');
  var crstage = document.getElementById('cr-stage');
  crstage.insertBefore(myPHead, proimg);
  Crafty.e('Head').DOM(myPHead).attr({x: shiftX -200, y: shiftY});


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
  BOSS = this.playerPosition;
  this.player = player = Crafty.e('PlayerCharacter').at(myX, myY);
  this.head = Crafty.e('Head').DOM(document.getElementById("profileImage"));
  this.playerPosition.attach(this.player);
  this.playerPosition.attach(this.head);
  
  this.occupied[this.player.at().x][this.player.at().y] = true;


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
});




// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Load our sprite map image
  Crafty.load(['assets/character.png','assets/zombie_mushroom.png','assets/good_mushroom.png','assets/sick_mushroom.png'], function(){
    // Once the images are loaded...

    Crafty.sprite(30,32,  'assets/zombie_mushroom.png', {
      spr_ZMushroom: [0, 0]
    });

    Crafty.sprite(39,34,  'assets/good_mushroom.png', {
      spr_GMushroom: [0, 0]
    });

    Crafty.sprite(30,29,  'assets/sick_mushroom.png', {
      spr_SMushroom: [0, 0]
    });

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