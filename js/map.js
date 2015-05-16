/* Map view model
 * contains knockout observables
 * and the map
 */
// the map should be accessable by other modules too
//var map;

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

var foursquare = function (query, callback) {
    /* Foursquare api module
     * comunicates with the foursquare api
     * returns json data
     */
    
    // Defaults for the api
    var FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/search';
    var CLIENT_ID = '0NF4PAQ2Q0HIF2XYTB5ICX135ZMSLYJXSSG0AMCFTMDA0M1G';
    var CLIENT_SECRET = 'OJBZPIO4OQGKH3TP3BQUJJXCODPIVZAZEVMKLAWG1B1J2J5Z';
    var VERSION = '20150511';
    var HOME = '38.706495,-9.156769';
    
    // JSON object holding foursquare data
    var defaultData = {
        client_id : CLIENT_ID,
        client_secret : CLIENT_SECRET,
        v : VERSION ,
        ll : HOME
    };
    
    var data = $.extend({}, defaultData, query);
        
    $.getJSON(FOURSQUARE_URL, data, callback);
};

function markerViewModel () {
    var self = this;
    self.pool = [];
    self.lat = ko.observable(map.getCenter().A);
    self.lng = ko.observable(map.getCenter().F);
    self.address = ko.observable('');
    self.title = ko.observable('Neighborhood Map');
    self.keep = ko.observable(false);
    self.radius = ko.observable(200);
    self.limit = ko.observable(50);
    self.markers = ko.observableArray();
    self.search = ko.observable('');
    self.filter = ko.observable('');

    self.lng.subscribe(function (newValue) {
        map.setCenter(self.lat(), self.lng());   
    });
    
    self.lat.subscribe(function (newValue) {
        map.setCenter(self.lat(), self.lng());   
    });
    
    
    // function to be called on submit filter
    self.submitFilter = function (formElement) {
        var markers = [];
        var filterString = self.filter().split('|');
        self.markers([]);
        $.each(filterString, function (i, filter) {
                var invert = false;
                if(filter[0] === '!') {
                    filter = filter.slice(1,filter.length - 1);
                    invert = true;
                }
                $.extend(markers, $.grep(self.pool, function(elem) {
                    console.log(filter.toLowerCase());
                    return (elem.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
                }, invert));
        });
        ko.utils.arrayPushAll(self.markers(), markers);
        self.markers.valueHasMutated();
        self.drawMarkers(self.markers());
    };

    // function to be called on submit search
    self.submitSearch = function (formElement) {
        var center = map.getCenter();
        self.lat(center.A);
        self.lng(center.F);
        map.hideInfoWindows();
        var queryString = self.search().split('|');
        if(!self.keep()) {
            self.markers([]);
            self.pool = [];
            map.removeMarkers();
        }
        // call the foursquare api with supplied queries
        $.each(queryString, function (i, value) {
            foursquare( {ll: self.lat() + ',' + self.lng(), query: value, radius: self.radius(), limit: self.limit() }, self.getMarkers);
        });
    };
    // filter out relevant information of the venues
    self.getMarkers = function (result) {
        if(result.meta.code !== 200) {
            console.log(self.title());
            return;
        }
        self.title('Neighborhood Map');
        venues = result.response.venues;
        var marker, res;
        var markers = [];
        $.each(venues, function (i, venue) {
            marker = refineMarker(venue);
            res = $.grep(self.markers(), function (elem) {
                return elem.id === marker.id});
            if (res.length == 0) {
                self.pool.push(marker);
                markers.push(marker);
            }
        });
        // inform the observable array of new markers
        // do this in one step instead for each element
        ko.utils.arrayPushAll(self.markers(), markers);
        self.markers.valueHasMutated();

        self.drawMarkers(self.markers());
    };

    self.drawMarkers = function (markers) {
        map.removeMarkers();
        $.each(markers, function (i, value) {
            map.addMarker(value.mapMarker);
        });
    };

    self.openInfoWindow = function (marker) {
        map.hideInfoWindows();
        (marker.mapMarker.infoWindow).open(marker.mapMarker.map, marker.mapMarker);
    };
    
    self.geoLocate = function() {
      GMaps.geolocate({
          success: function(position) {
              self.title('Neighborhood Map');
              self.lat(position.coords.latitude);
              self.lng(position.coords.longitude);
              map.setCenter(position.coords.latitude, position.coords.longitude);
          },
          error: function(error) {
            self.title('Geolocation failed: '+error.message);
          },
          not_supported: function() {
            self.title("Your browser does not support geolocation");
          },
          always: function() {
          }
        });  
    };
    
    self.geoCode = function () {
        GMaps.geocode({
            address: self.address(),
                callback: function(results, status) {
                    if (status == 'OK') {
                        self.title('Neighborhood Map');
                        var latlng = results[0].geometry.location;
                        map.setCenter(latlng.lat(), latlng.lng());
                        self.lat(latlng.lat());
                        self.lng(latlng.lng());
                    } else {
                        self.title('Address not found');
                    }
                }
            });
    };
    
    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });

    $.each('Pérola|Carris|bar'.split('|'), function (i, value) {
        foursquare( {query: value, radius: 200, limit: 50 }, self.getMarkers);
    });
}



// filter out the relevant info from a venue
function refineMarker(venue) {
    var marker = {};
    marker.visible = true;
    marker.id = venue.id;
    marker.name = venue.name;
    if (venue.categories.length > 0) {
        marker.category = venue.categories[0].name;
    }
    else {
        marker.category = '';
    }
    marker.lat = venue.location.lat;
    marker.lng = venue.location.lng;
    marker.address = venue.location.formattedAddress.join(', ');
    marker.mapMarker = map.createMarker({
        lat: marker.lat,
        lng: marker.lng,
        title: marker.name,
        infoWindow: {
            content: '<h3>' + marker.name + '</h3>' +
                     '<p>' + marker.address + '</p>'
        }
    });
    return marker;
}

var mvm = new markerViewModel();
ko.applyBindings(mvm);


// setTimeout(function() {
//     console.log(mvm.markers());
// }, 10000);