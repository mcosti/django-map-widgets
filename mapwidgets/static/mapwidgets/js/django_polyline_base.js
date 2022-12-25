(function ($) {
    $(document).ready(function () {
        const ICON_START_MARKER = "/static/mapwidgets/images/pin.png";
        const ICON_END_MARKER = "/static/mapwidgets/images/pin.png";
        mapWidgetOptions.mapWrapperElem.style.display = 'block';
        mapWidgetOptions.mapMessageElem.style.display = 'none';

        function getWaypointIcon(title) {
            return 'data:image/svg+xml;utf-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>`
            );
        }

        if (mapWidgetOptions.locationFieldValue) {
            var data = JSON.parse(mapWidgetOptions.locationFieldValue);
            data = data.coordinates;
            var totalWaypoints = data.length;
            if (!totalWaypoints) {
                console.error('No waypoints found', totalWaypoints);
                return
            }
            var mapCenter = mapWidgetOptions.mapCenterLocation ?
            // Set based on your region
            mapWidgetOptions.mapCenterLocation : [0, 0];

            var map = initMap(mapWidgetOptions.mapElement, {
                center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                },
                zoomControl: true,
                gestureHandling: 'cooperative',
                zoom: mapWidgetOptions.zoom
            });
            var polylineData = [];
            bounds = new google.maps.LatLngBounds();
            for (var i = 0 ; i < totalWaypoints; i++) {
                var coords = data[i];
                var total_geopoints = coords.length;
                for (var j = 0; j < total_geopoints; j++) {
                    var markerPosition = {
                        'lat': coords[j][1],
                        'lng': coords[j][0]
                    };
                    polylineData.push(markerPosition);

                    var _location = getGoogleLatLngObject(markerPosition.lat, markerPosition.lng);
                    bounds.extend(_location);

                    var markerOptions = {
                        draggable: false,
                        optimized: false,
                        position: _location,
                        icon: {},
                        map: map
                    };

                    if (i === 0 && j === 0) {
                        // Marker for Source
                        markerOptions.icon.url = ICON_START_MARKER;
                        data[i].marker = initMarker(map, markerOptions);
                    } else if ((i === (totalWaypoints - 1)) &&
                        (j === (total_geopoints - 1))) {
                        // Marker for Destination
                        markerOptions.icon.url = ICON_END_MARKER;
                        data[i].marker = initMarker(map, markerOptions);
                    } else if (j === (total_geopoints - 1)) {
                        // Marker for each waypoint
                        markerOptions.icon.url = getWaypointIcon(i + 1);
                        data[i].marker = initMarker(map, markerOptions);
                    }
                }
            }

            // Draw route on map
            var path = new google.maps.Polyline({
                path: polylineData,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            path.setMap(map);
            map.fitBounds(bounds);
            google.maps.event.trigger(map, 'resize');

            // Need to refresh when map is inside tab.
            $('.changeform-tabs-item, .changeform-tabs-item-link').on('click', function (e) {
                e.stopPropagation();
                var refresh = function () {
                    center = map.getCenter();
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(center);
                    map.setZoom(15);
                };
                setTimeout(refresh, 100);
            });
        } else {
            mapWidgetOptions.mapWrapperElem.style.display = 'none';
            mapWidgetOptions.mapMessageElem.style.display = 'block';
        }
    });
})(jQuery || django.jQuery);
