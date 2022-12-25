(function ($) {
    DjangoGooglePolyFieldWidget = DjangoMapPolyWidgetBase.extend({

        initializeMap: function () {
            var mapCenter = [];
            var mapCenter = mapWidgetOptions.mapCenterLocation;
            if (!mapCenter) {
                // Set based on your region
                mapCenter = [0, 0];
            }
            this.map = new google.maps.Map(this.mapElement, {
                center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
                scrollwheel: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                },
                zoomControl: true,
                gestureHandling: 'cooperative',
                zoom: this.zoom,
            });
            map = this.map;
            this.setupDrawingManager(this.locationFieldValue);
            this.polygon = this.initPolygon();
            if (!$.isEmptyObject(this.locationFieldValue)) {
                if (this.locationFieldValue.length) {
                    this.processedData = this.processPolyData();
                    this.setPolygonPath(this.processedData);
                    this.setPolygonOptions();
                    this.setMapForPolygon();
                    this.setSelection(this.polygon);
                    this.setDrawingMode(null);
                    this.fitBound();
                }
            }
            google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.handleOverlayComplete.bind(this));
            google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', this.handleDrawingModeChanged.bind(this));
            google.maps.event.addListener(this.getPath(), 'set_at', this.handleInsertAtEvent.bind(this));
            google.maps.event.addListener(this.getPath(), 'insert_at', this.handleInsertAtEvent.bind(this));
            this.resizeMap();
            this.fitZoomBtn.on("click", this.fitBound.bind(this));
        },
        resizeMap: function () {
            google.maps.event.trigger(this.map, 'resize');
        },
        setupDrawingManager: function () {
            this.drawingManager = this.initDrawingManager();
            this.drawingManager.setMap(map);
        },
        initDrawingManager: function () {
            return new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER,
                    drawingModes: ['polygon']
                },
                polygonOptions: mapWidgetOptions.polyOptions
            });
        },
        processPolyData: function () {
            var coordinate_list = [];
            var coordinates = JSON.parse(this.locationFieldValue).coordinates[0];
            for (i = 0; i < coordinates.length; i++) {
                coordinate_list.push(new google.maps.LatLng(coordinates[i][1], coordinates[i][0]));
            }
            return coordinate_list;
        },
        initPolygon: function () {
            return new google.maps.Polygon();
        },
        setPolygonPath: function (coordinate_list) {
          this.polygon.setPath(coordinate_list);
        },
        setPolygonOptions: function () {
            this.polygon.setOptions(this.polyOptions);
        },
        setMapForPolygon: function () {
            this.polygon.setMap(map);
        },
        getPath: function () {
            return this.polygon.getPath();
        },
        setSelection: function (shape) {
            if (this.selectedShape) {
                this.selectedShape.setMap(null);
            }
            this.selectedShape = shape;
            this.selectedShape.setEditable(true);
        },
        fitBound: function () {
            if (!this.processedData) {
                return
            }
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < this.processedData.length; i++) {
                bounds.extend(this.processedData[i]);
            }
            this.map.fitBounds(bounds);
        },
        setDrawingMode: function (mode) {
            this.drawingManager.setDrawingMode(mode);
        },
        addMapData: function () {
            this.map.data.add(new google.maps.Data.Feature({
                geometry: new google.maps.Data.Polygon([this.newShape.getPath().getArray()])
            }));
        },
        deleteSelectedShape: function () {
            if (this.selectedShape) {
                this.selectedShape.setMap(null);
            }
        },
        getLatLngString: function (point) {
            var lat = point.lat();
            var lng = point.lng();
            return `${lng.toString()} ${lat.toString()}`;
        },
        getPolygonStringList: function(_path) {
            var points = _path.getArray();
            var polyData = [];
            var total_points = points.length;
            for (var i = 0; i < total_points; i++) {
                polyData.push(this.getLatLngString(points[i]));
            }
            if (total_points) {
                polyData.push(this.getLatLngString(points[0]));
            }
            return polyData;
        },
        getPolygonAsLatLngList: function(_path) {
            var points = _path.getArray();
            var polyData = [];
            var total_points = points.length;
            for (var i = 0; i < total_points; i++) {
                polyData.push({
                    lat: points[i].lat(),
                    lng: points[i].lng(),
                });
            }
            if (total_points) {
                polyData.push({
                    lat: points[0].lat(),
                    lng: points[0].lng(),
                });
            }
            return polyData;

        },
        convertToWkt: function (_path) {
            var polyData = this.getPolygonStringList(_path);
            var val = "POLYGON ((" + polyData.join(", ") + "))";
            this.locationInput.val(val);
        },
        displayCoordinates: function () {
            console.warn('Not implemented displayCoordinates');
        },
        handleOverlayComplete: function (e) {
            if (e.type === google.maps.drawing.OverlayType.POLYGON) {
                // Switch back to non-drawing mode after drawing a shape.
                this.drawingManager.setDrawingMode(null);
                this.setSelection(e.overlay);
                this.polygon_path = e.overlay.getPath();
                this.processedData = this.getPolygonAsLatLngList(this.polygon_path);
                // var newShape = e.overlay;
                // newShape.type = e.type;
                this.convertToWkt(this.polygon_path);
            }
        },
        handleDrawingModeChanged: function (e) {
            this.deleteSelectedShape();
            this.polygon_path = null;
        },
        handleSetAtEvent: function (s) {
            this.polygon_path = this.getPath();
            this.selectedShape.setEditable(true);
            this.convertToWkt(this.getPath());
        },
        handleInsertAtEvent: function (s) {
            this.polygon_path = this.getPath();
            this.selectedShape.setEditable(true);
            this.convertToWkt(this.getPath());
        }
    });
})(jQuery || django.jQuery);
