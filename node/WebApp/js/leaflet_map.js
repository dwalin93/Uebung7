"use strict";

/**
 *   settings to send the jsnlog-messages to the console of the browser
 */
var consoleAppender = JL.createConsoleAppender('consoleAppender');
JL().setOptions({"appenders": [consoleAppender]});



var map = L.map('mapid');
var myLayer;
var dbFeatures;

window.onload = function () {

    map.setView([51.95, 7.63], 12);


    /**
     * Leaflet functions which builds the map with layers and menu to fade in or out polygon
     * Source: https://jsfiddle.net/adegbelo/yrvja9p9/
     * @param event
     */

        //

    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);


    var osmLayer2 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRlZ2JlbG8iLCJhIjoiY2ozNXpidW8yMDF1bTMybzZuejR4Mjg4ZyJ9.ZCYlOyYKC1-WeXD2Rx3NTQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'geosoft2017_demo',
        accessToken: 'pk.eyJ1IjoiYWRlZ2JlbG8iLCJhIjoiY2ozNXpidW8yMDF1bTMybzZuejR4Mjg4ZyJ9.ZCYlOyYKC1-WeXD2Rx3NTQ'
    });

// Add a

//add layer switcher
    var baseMaps = {
        "Map1": osmLayer,
        "Map2": osmLayer2
    };

    myLayer = L.layerGroup();

    var overlayMaps = {
        "Lines": myLayer
    };

// Initialise the FeatureGroup to store database layers
    dbFeatures = new L.FeatureGroup();
    map.addLayer(dbFeatures);

//Layer control function
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    osmLayer.addTo(map);


    JL().info("Ready");
};
// add a marker at the Mensa am Ring.
// marker popup contains the image
L.marker([51.965475, 7.600272]).addTo(map)
    .bindPopup("<b>Mensa am Ring</b><br>Domagkstraße 61<br>48149 Münster<br>" +
        "<a href=\"https://muenster.my-mensa.de/index.php?v=4992033&hyp=1\">" +
        "<img width=\"150\" src=\"picture/mensa-am-ring_1.jpg\" alt=\"picture Mensa\" >" +
        "</a>");

/**
 * Fades the map in in 3 seconds when clicked on button
 */
function fadeIn() {
        $("#mapid").fadeIn(3000);

}

/**
 * Fades the map out in 3 seconds when clicked on button
 */
function fadeOut() {
    $("#mapid").fadeOut(3000);
}


/**
 * Locates the user
 */
function locateUser(){
    map.locate({
        setView:true,
        maxZoom:14
    });
};

/**
 * If the user is found, a popup appears and shows the users location in a certain radius
 */
map.on('locationfound', function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
    L.circle(e.latlng,radius).addTo(map);

    JL().info("Location was found. ("+ e.latlng+ ")");
});
/**
 * Throw error if user is not found
 */
map.on('locationerror', function onLocationError(e){
    alert("We were not able to find you");
    JL().error("Your Location could not be found.");
});