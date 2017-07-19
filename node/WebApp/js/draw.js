// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

/**
 * Enables the user to draw certain features on the map
 * @type {{edit: {featureGroup: *}, draw: {polyline: {shapeOptions: {color: string}}, polygon: {showArea: boolean, allowIntersection: boolean, drawError: {color: string, message: string}, shapeOptions: {color: string}}, circle: {shapeOptions: {color: string}}, rectangle: {shapeOptions: {color: string}}}}} draw options
 */
var drawOptions = {
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polyline: {
            shapeOptions: {
                color: '#4c4cff'
            }
        },
        polygon: {
            showArea: true,
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#4c4cff',
                message: 'Sorry you can not do that!'
            },
            shapeOptions: {
                color: '#4c4cff'
            }

        },
        circle: {
            shapeOptions: {
                color: '#4c4cff'
            }
        },
        rectangle: {
            shapeOptions: {
                color: '#4c4cff'
            }
        }
    }
};
var drawControl = new L.Control.Draw(drawOptions);

map.addControl(drawControl);

// if a shape is drawn, add it to the layer
map.on('draw:created', function (e) {
    drawnItems.addLayer(e.layer);


});


/**
 * Clear the map from drawn features
 *
 */
document.getElementById('delete').onclick = function() {
    drawnItems.clearLayers();
};

/**
 * Download the drawn shape as .json
 *
 */
document.getElementById('export').onclick = function() {
    // Extract GeoJson from featureGroup
    var data = drawnItems.toGeoJSON();

    // Stringify the GeoJson
    var convertData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertData);
    document.getElementById('export').setAttribute('download','data.geojson');
};