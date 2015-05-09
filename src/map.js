var playerLoc = new google.maps.LatLng(-34.377, 150.644);
var speed = 0.01;
// define a handler
function doc_keyUp(e) {
   // this would test for whichever key is 40 and the ctrl key at the same time
   if (e.keyCode == 38) {
      // call your function to do the thing
      panUP();
   }
   else if (e.keyCode == 40) {
    panDOWN();
   }
   else if (e.keyCode == 37) {
    panLEFT();
   }
   else if (e.keyCode == 39) {
    panRIGHT();
   }
}
function panUP() {
   playerLoc = new google.maps.LatLng(playerLoc.lat()+speed, playerLoc.lng());
   map.panTo(playerLoc);
}
function panDOWN() {
   playerLoc = new google.maps.LatLng(playerLoc.lat()-speed, playerLoc.lng());
   map.panTo(playerLoc);
}
function panLEFT() {
   playerLoc = new google.maps.LatLng(playerLoc.lat(), playerLoc.lng()-speed);
   map.panTo(playerLoc);
}
function panRIGHT() {
   playerLoc = new google.maps.LatLng(playerLoc.lat(), playerLoc.lng()+speed);
   map.panTo(playerLoc);
}
var map;
function initialize() {
   var mapOptions = {
        center: playerLoc,
        zoom: 14,           // set the zoom level manually
        zoomControl: false,
        scaleControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        draggable: false,
        keyboardShortcuts: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   map = new google.maps.Map(document.getElementById("map_canvas"),
         mapOptions);
}