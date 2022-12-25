const WIDGET_MAP_CENTER = [0, 0]; // [LONGITUDE, LATTITUDE] <- python postgis convention

// Function to initialize google map object
function initMap(element, options) {
    console.log("Initializing map");
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(WIDGET_MAP_CENTER[1], WIDGET_MAP_CENTER[0]),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
    };
    for (key in options) {
        mapOptions[key] = options[key];
    }
    return new google.maps.Map(element, mapOptions);
}

// Function to initialize google autocomplete object
function initAutoComplete(map, input) {
    var options = {
        componentRestrictions: {
            country: 'IN'
        }
    };
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    //Bias the autocomplete to users current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: 10000 //radius in meters, 10km
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
    return autocomplete;
}

// Function to setup map marker, if no options is passed then default options will be used
function initMarker(map, options, marker_type) {
    // Default icon will be pickup marker
    var marker_icon_url = 'static/website/images/map_marker_pickup.png';
    if (marker_type === 'dropoff') {
        marker_icon_url = 'static/website/images/map_marker_dropoff.png';
    } else if (marker_type === 'waypoint') {
        marker_icon_url = 'static/website/images/waypoint.png';
    }
    var markerOptions = {
        position: new google.maps.LatLng(WIDGET_MAP_CENTER[1], WIDGET_MAP_CENTER[0]),
        icon: {
            url: marker_icon_url,
            anchor: new google.maps.Point(36, 48),
        },
        draggable: true,
        map: map,
    };
    for (key in options) {
        markerOptions[key] = options[key];
    }
    return new google.maps.Marker(markerOptions);
}

// Function to initialize infowindow
function initInfoWindow(options) {
    var infowindowOptions = {
        pixelOffset: new google.maps.Size(0, 12)
    };
    for (key in options) {
        infowindowOptions[key] = options[key];
    }
    return new google.maps.InfoWindow(infowindowOptions);
}

// Function to initialize circle, if no options is passed then default options will be used
function initCircle(map, options) {
    var circleOptions = {
        center: new google.maps.LatLng(WIDGET_MAP_CENTER[1], WIDGET_MAP_CENTER[0]),
        radius: 50,
        strokeColor: '#00C0E1',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#00C0E1',
        fillOpacity: 0.25,
        map: map,
    };
    for (key in options) {
        circleOptions[key] = options[key];
    }
    return new google.maps.Circle(circleOptions);
}

// Function to draw polyline on the map
function drawPolyline(map, options) {
    var polylineOptions = {
        path: new google.maps.LatLng(WIDGET_MAP_CENTER[1], WIDGET_MAP_CENTER[0]),
        geodesic: true,
        strokeColor: '#f74757',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
    };
    for (key in options) {
        polylineOptions[key] = options[key];
    }
    return new google.maps.Polyline(polylineOptions);
}

// Function to get default lat/lng object
function getDefaultLatLng() {
    return new google.maps.LatLng(WIDGET_MAP_CENTER[1], WIDGET_MAP_CENTER[0]);
}

// Returns google lat-lng object
function getGoogleLatLngObject(lat, lng) {
    return new google.maps.LatLng(WIDGET_MAP_CENTER[1], WIDGET_MAP_CENTER[0]);
}

function initGeocoder() {
    return new google.maps.Geocoder;
}

// Initializes lat-lng-bounds object
function initLatLngBounds() {
    return new google.maps.LatLngBounds();
}

// Initializes anchor for marker with position x and y in a 2-dimensional plane
function initAnchorPoint(x, y) {
    return new google.maps.Point(x, y);
}

// Initializes heatmap layer
function initHeatmapLayer(options) {
    var options = options || {};
    return new google.maps.visualization.HeatmapLayer(options);
}

// Returns an array initialized with constructor class MVCArray()
function getMVCArray(data) {
    return new google.maps.MVCArray(data);
}

// Triggers map resizing
function triggerMapResize(map) {
    google.maps.event.trigger(map, 'resize');
}

// Function to add map autocomplete listener, that takes two parameters(map, autocomplete objects),
// the last one a callback function
function addAutoCompleteListener(map, autocomplete, changedPlace) {
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(10);
        }
        changedPlace(place.geometry.location);
    });
}

// Function to initialize directions service
function initDirectionsService() {
    return new google.maps.DirectionsService();
}

// Function to initialize directions renderer
function initDirectionsRenderer(options) {
    var directionOptions = {
        suppressMarkers: true,
        polylineOptions: {
            geodesic: true,
            strokeColor: '#f74757',
            strokeOpacity: 1.0,
            strokeWeight: 4
        }
    };
    for (key in options) {
        directionOptions[key] = options[key];
    }
    return new google.maps.DirectionsRenderer(directionOptions);
}

// Initializes click event listener for marker to open infowindow
function initMarkerClickListener(map, placeMarker, infoWindow) {
    google.maps.event.addListener(placeMarker, 'click', (function (marker, info) {
        return function () {
            info.open(map, marker);
        }
    })(placeMarker, infoWindow));
}
