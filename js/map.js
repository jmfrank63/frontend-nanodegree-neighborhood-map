/*global $, GMaps, ko */
/*jshint unused: true, node: true */
/*jslint unparam: true, node: true */

/* Map view model
 * contains knockout observables
 * the map
 */
'use strict';
// the map should be globally accessable
var map;

$((function () {
    // the initial coordinates
    var mapCenter = {lat: 38.706495, lng: -9.156769};
    // define a new map
    map = new GMaps({
        div: '#map-canvas',
        center: mapCenter,
        zoom: 17
    });
}()));

var foursquare = function (query, callback) {
    /* Foursquare api module
     * comunicates with the foursquare api
     * returns json data
     */

    // Defaults for the api
    var FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/search',
        CLIENT_ID = '0NF4PAQ2Q0HIF2XYTB5ICX135ZMSLYJXSSG0AMCFTMDA0M1G',
        CLIENT_SECRET = 'OJBZPIO4OQGKH3TP3BQUJJXCODPIVZAZEVMKLAWG1B1J2J5Z',
        VERSION = '20150511',
        HOME = '38.706495,-9.156769',
        // JSON object holding foursquare data
        defaultData = {
            client_id : CLIENT_ID,
            client_secret : CLIENT_SECRET,
            v : VERSION,
            ll : HOME
        },

        // merge default data with given options overwriting the defaults
        data = $.extend({}, defaultData, query);

    // the actual ajax call
    $.getJSON(FOURSQUARE_URL, data, callback);
};

// filter out the relevant info from a venue
// since we do not use the mapping plugin we
// have to do this by our own
function refineMarker(venue) {
    var marker = {};
    marker.visible = true;
    marker.id = venue.id;
    marker.name = venue.name;
    if (venue.categories.length > 0) {
        marker.category = venue.categories[0].name;
    } else {
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

// the knockout viewModel
function MarkerViewModel() {
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

    // if the center changes update the observables
    self.lng.subscribe(function () {
        self.title('Neighborhood Map');
        map.setCenter(self.lat(), self.lng());
    });
    self.lat.subscribe(function () {
        self.title('Neighborhood Map');
        map.setCenter(self.lat(), self.lng());
    });

    // function to be called on submit filter
    self.submitFilter = function (formElement) {
        // clear all markers and fill them again with filtered markers
        var markers = [],
            // split the filter string into an array and loop over it
            filterString = self.filter().split('|');
        self.markers([]);
        $.each(filterString, function (i, filter) {
            var invert = false;
            // check for invertion exclamation marks
            if (filter[0] === '!') {
                filter = filter.slice(1, filter.length - 1);
                invert = true;
            }
            // find all matching filter terms
            $.extend(markers, $.grep(self.pool, function (elem) {
                return (elem.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
            }, invert));
        });
        // now do the update to the observable array
        // do this in one call and then notify the change
        ko.utils.arrayPushAll(self.markers(), markers);
        self.markers.valueHasMutated();
        // finally update the markes
        self.drawMarkers(self.markers());
    };

    // function to be called on submit search
    self.submitSearch = function (formElement) {
        // get the center so the search is located in
        // the visible area
        var center = map.getCenter(),
        // split the query string into an array of search terms
            queryString = self.search().split('|');
        self.lat(center.A);
        self.lng(center.F);
        // hide infoboxes prior to searching
        map.hideInfoWindows();
        if (!self.keep()) {
            self.markers([]);
            self.pool = [];
            map.removeMarkers();
        }
        // call the foursquare api with supplied queries
        $.each(queryString, function (i, value) {
            foursquare({ll: self.lat() + ',' + self.lng(), query: value, radius: self.radius(), limit: self.limit()}, self.getMarkers);
        });
    };
    // filter out relevant information of the venues
    self.getMarkers = function (result) {
        // check if api call was successful
        // if not show error message
        if (result.meta.code !== 200) {
            self.title('Results are not available!');
            return;
        }
        // show title if everything is ok
        self.title('Neighborhood Map');
        var venues = result.response.venues,
            marker,
            res,
            markers = [];
        // loop over all places and add them to the observable array
        $.each(venues, function (i, venue) {
            marker = refineMarker(venue);
            res = $.grep(self.markers(), function (elem) {
                return (elem.id === marker.id);
            });
            if (res.length === 0) {
                self.pool.push(marker);
                markers.push(marker);
            }
        });
        // inform the observable array of new markers
        // do this in one step instead for each element
        ko.utils.arrayPushAll(self.markers(), markers);
        self.markers.valueHasMutated();
        // finally draw the markers
        self.drawMarkers(self.markers());
    };

    // put the markers in the array into the map
    self.drawMarkers = function (markers) {
        map.removeMarkers();
        $.each(markers, function (i, value) {
            map.addMarker(value.mapMarker);
        });
    };

    // open the infobox of a marker
    self.openInfoWindow = function (marker) {
        map.hideInfoWindows();
        (marker.mapMarker.infoWindow).open(marker.mapMarker.map, marker.mapMarker);
    };

    // locate the position of the user
    self.geoLocate = function () {
        GMaps.geolocate({
            success: function (position) {
                self.title('Neighborhood Map');
                self.lat(position.coords.latitude);
                self.lng(position.coords.longitude);
                map.setCenter(position.coords.latitude, position.coords.longitude);
            },
            error: function (error) {
                self.title('Geolocation failed: ' + error.message);
            },
            not_supported: function () {
                self.title("Your browser does not support geolocation");
            }
        });
    };

    self.geoCode = function () {
        GMaps.geocode({
            address: self.address(),
            callback: function (results, status) {
                if (status === 'OK') {
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

    // prevent the preferences dropdown menu from closing when clicked
    $('.dropdown-menu input, .dropdown-menu label').click(function (event) {
        event.stopPropagation();
    });

    // put some starting values on the map
    $.each(['Pérola', 'Carris', 'bar'], function (i, value) {
        foursquare({query: value, radius: 200, limit: 50 }, self.getMarkers);
    });
}


// create the viewModel
var mvm = new MarkerViewModel();

// apply the knockout mapping
ko.applyBindings(mvm);
