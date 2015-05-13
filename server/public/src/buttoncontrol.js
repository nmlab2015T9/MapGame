function PButtonOnClick() {
    map.panTo(choosedLocation);
    setTimeout("map.setZoom(18)",500);
}
function CButtonOnClick() {
    map.panTo(choosedLocation);
    setTimeout("map.setZoom(18)",500);
    //window.addEventListener('load', Game.start);
    document.getElementById("cr-stage").style.display = "inherit";
    //document.getElementById("profileImage").style.display = "inherit";
    document.getElementById("positionChooser").style.display = "none";
    marker.setVisible(false);
}