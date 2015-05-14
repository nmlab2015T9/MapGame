
function PButtonOnClick() {
	map.panTo(choosedLocation);
	setTimeout("map.setZoom(18)",500);
}
function CButtonOnClick() {
	map.panTo(choosedLocation);
	setTimeout("map.setZoom(18)",500);
	Game.start();
	document.getElementById("cr-stage").style.display = "inherit";
	document.getElementById("profileImage").style.display = "inherit";
	document.getElementById("positionChooser").style.display = "none";
	marker.setVisible(false);
	
	map.setOptions({zoomControl: false,
					scaleControl: false,
					scrollwheel: false,
					disableDoubleClickZoom: true,
					draggable: false,
					keyboardShortcuts: false,
					})
}
