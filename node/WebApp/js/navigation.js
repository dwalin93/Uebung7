/**
 * Created by pglah on 16.07.2017.
 */

function button(label, container) {
    var button = L.DomUtil.create('button', '', container);
    button.setAttribute('type', 'button');
    button.innerHTML = label;
    return button;
}

var control = L.Routing.control({
    routeWhileDragging: true,
    plan: new (L.Routing.Plan.extend({
        createGeocoders: function() {
            var container = L.Routing.Plan.prototype.createGeocoders.call(this),
                reverseButton = button('&#8593;&#8595;', container);

            L.DomEvent.on(reverseButton, 'click', function() {
                var waypoints = this.getWaypoints();
                this.setWaypoints(waypoints.reverse());
            }, this);

            return container;
        }
    }))([
        null
    ], {
        geocoder: L.Control.Geocoder.nominatim(),
        language:'de',
        routeWhileDragging: true
    })
})
    .on('routingerror', function(e) {
        try {
            map.getCenter();
        } catch (e) {
            map.fitBounds(L.latLngBounds(control.getWaypoints().map(function(wp) { return wp.latLng; })));
        }

        handleError(e);
    })
    .addTo(map);

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = button('Start from this location', container),
        destBtn = button('Go to this location', container);

    L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);
        map.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        map.closePopup();
    });

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);
});

(function() {
    'use strict';

    L.Routing.routeToGeoJson = function(route) {
        var wpNames = [],
            wpCoordinates = [],
            i,
            wp,
            latLng;

        for (i = 0; i < route.waypoints.length; i++) {
            wp = route.waypoints[i];
            latLng = L.latLng(wp.latLng);
            wpNames.push(wp.name);
            wpCoordinates.push([latLng.lng, latLng.lat]);
        }

        return {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {
                        id: 'waypoints',
                        names: wpNames
                    },
                    geometry: {
                        type: 'MultiPoint',
                        coordinates: wpCoordinates
                    }
                },
                {
                    type: 'Feature',
                    properties: {
                        id: 'line',
                    },
                    geometry: L.Routing.routeToLineString(route)
                }
            ]
        };
    };

    L.Routing.routeToLineString = function(route) {
        var lineCoordinates = [],
            i,
            latLng;

        for (i = 0; i < route.coordinates.length; i++) {
            latLng = L.latLng(route.coordinates[i]);
            lineCoordinates.push([latLng.lng, latLng.lat]);
        }

        return {
            type: 'LineString',
            coordinates: lineCoordinates
        };
    };
})();


control.on('routesfound', function(e) {
    console.log(L.Routing.routeToGeoJson(e.routes[0]));
});

L.Routing.errorControl(control).addTo(map);



/**function saveRouteToDB() {
    var name = prompt('Please insert the desired name for the route:');
    var items = L.Routing.routeToGeoJson(e.routes[0]);

    if ( name != undefined && items != '' ) {
        var url = $('#dbUrl').val() + '/addFeature?name=' + name;

        // perform post ajax
        $.ajax({
            type: 'POST',
            data: items,
            url: url,
            timeout: 5000,
            success: function(data, textStatus ){
                JL().info("feature was succesfully added to the database on " + url);
            },
            error: function(xhr, textStatus, errorThrown){
                JL().error('unable to save to database (' + errorThrown + ')');
            }
        });


    } else {
        JL().error('unable to save to database: Please provide json or name');
    }
};

**/