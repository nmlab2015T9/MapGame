
function PButtonOnClick() {
	map.panTo(choosedLocation);
	setTimeout("map.setZoom(18)",500);
}
function CButtonOnClick() {
	map.panTo(choosedLocation);
	setTimeout("map.setZoom(18)",500);
	document.getElementById("PButton").style.display = "none";
	document.getElementById("CButton").style.display = "none";
	document.getElementById("positionTitle").style.display = "none";
	document.getElementById('status2').innerHTML ='Game Initializing...Please Wait...';
	marker.setVisible(false);
	map.setOptions({zoomControl: false,
					scaleControl: false,
					scrollwheel: false,
					disableDoubleClickZoom: true,
					draggable: false,
					keyboardShortcuts: false,
					})
	sendCenter(choosedLocation.lat(), choosedLocation.lng());
}
