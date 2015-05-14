var startLoc = new google.maps.LatLng(25.0159, 121.5392);
//var playerLoc;
//var speed = 0.01;
// define a handler

/*function panMap(loc) {
   startLoc = new google.maps.LatLng(loc.lat, loc.lng);
   //console.log(loc);
   map.panTo(startLoc);
}*/
var map;
var choosedLocation = startLoc;
var marker

function initialize() {
   var mapOptions = {
        center: startLoc,
        zoom: 5,           // set the zoom level manually
        mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   map = new google.maps.Map(document.getElementById("map_canvas"),
         mapOptions);
		 
			var mystyle = [
		{
			stylers: [
			{ hue: "#ff0000" },
			{ saturation: 100 }
			]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
			{ hue: "#66F934" },
			{ lightness: 100 },
			//{ visibility: "simplified" }
			]
		},{
			featureType: "water",
			elementType: "geometry",
			stylers: [
			{ color: "#BBBBFF" }
			]
		},{
			featureType: "All",
			elementType: "labels",
			stylers: [
			{ visibility: "off" }
			]
		},{
			featureType: "road",
			elementType: "labels",
			stylers: [
			{ visibility: "off" }
			]
		}
		];
		
	marker = new google.maps.Marker({
		position: startLoc, 
		map: map
    });
		
	map.setOptions({styles: mystyle})
	
	var directionsService = new google.maps.DirectionsService();

    google.maps.event.addListener(map, 'click', function(event) {
		var request = {
			origin:event.latLng, 
			destination:event.latLng,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
	
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				choosedLocation = response.routes[0].legs[0].start_location;
				placeMarker(choosedLocation);
			}
		});
	});
	
	
	//google.maps.event.addListener(map, 'click', function(event) {
	//	placeMarker(event.latLng);
	//	choosedLocation = event.latLng;
	//});

}
function placeMarker(location) {
	marker.setPosition(location);
}