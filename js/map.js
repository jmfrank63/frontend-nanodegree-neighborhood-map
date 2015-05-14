// the map should be accessable by other modules too
var map;

$(function () {
    'use strict';
    
    var mapCenter = { lat: 38.706495,  lng: -9.156769 };
    
    // define a new map
    map = new GMaps({
        div: '#map-canvas',
        center: mapCenter,
        zoom: 17
    });

} ());