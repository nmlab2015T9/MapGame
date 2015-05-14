function stateCome() {
	console.log('GameState: ' + gameState);
	if(gameState == "one"){
		document.getElementById("titleAndLogIn").style.display = "none";
		document.getElementById("map_canvas").setAttribute("style","-webkit-filter:blur(0px)");
		document.getElementById("positionChooser").style.display = "inline";
	}
	else if(gameState == "wait"){
		
		//wait for mapArrayCome()
		
	}
	else if(gameState == "start"){
		
	}
	else if(gameState == "stop"){
		
	}
	else{}
}

function mapArrayCome(){
	console.log("Map array comes~~");
	document.getElementById("titleAndLogIn").style.display = "none";
	document.getElementById("map_canvas").setAttribute("style","-webkit-filter:blur(0px)");
	document.getElementById("cr-stage").style.display = "inherit";
	document.getElementById("profileImage").style.display = "inherit";
	document.getElementById("positionChooser").style.display = "none";
	marker.setVisible(false);
	console.log("Game Initializing!!");
	Game.start();
}