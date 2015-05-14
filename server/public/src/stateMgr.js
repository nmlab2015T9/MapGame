function stateCome() {
	console.log('GameState: ' + gameState);
	if(gameState == "one"){
		var im = document.getElementById("profileImage").setAttribute("src", "http://graph.facebook.com/" + ID + "/picture?type=normal");
		var im = document.getElementById("profileImage").setAttribute("style", "width:50px;height:50px");
		var im = document.getElementById("profileImage").style.display = "none";
		document.getElementById("titleAndLogIn").style.display = "none";
		document.getElementById("map_canvas").setAttribute("style","-webkit-filter:blur(0px)");
		document.getElementById("positionChooser").style.display = "inline";
	}
	else if(gameState == "wait"){
		
	}
	else if(gameState == "start"){
		
	}
	else if(gameState == "stop"){
		
	}
	else{}
}

function mapArrayCome(){
	Game.start();
}