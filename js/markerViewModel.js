/* Map view model
 * contains knockout observables
 * holding places
 */

function markerViewModel () {
    var self = this;
    self.venues = [];
    self.keep = ko.observable(false);
    self.radius = ko.observable(200);
    self.limit = ko.observable(50);
    self.markers = ko.observableArray()
    self.search = ko.observable('');
    self.filter = ko.observable('');
    
    // function to be called on submit filter
    self.submitFilter = function (formElement) {
      console.log(self.filter());  
    };

    // function to be called on submit search
    self.submitSearch = function (formElement) {
        var queryString = self.submit().split('|');
        console.log(self.keep());
        if(!self.keep()) {
            self.markers([]);
            self.venues = [];
            map.removeMarkers();
        }
        // call the foursquare api with supplied queries
        $.each(queryString, function (i, value) {
            foursquare( {query: value, radius: self.radius(), limit: self.limit() }, self.getMarkers);
        });
    };
    // filter out relevant information of the venues
    self.getMarkers = function (result) {
        venues = result.response.venues;
        var marker, res;
        var markers = [];
        $.each(venues, function (i, venue) {
            marker = filterMarker(venue);
            res = $.grep(self.markers(), function (elem) {
                return elem.id === marker.id});
            if (res.length == 0) {
                self.venues.push(marker);
                markers.push(marker);
            }
        });
        // inform the observable array of new markers
        // do this in one step instead for each element
        ko.utils.arrayPushAll(self.markers(), markers);
        self.markers.valueHasMutated();

        $.each(self.markers(), function (i, value) {
            map.addMarker(value.mapMarker);
        });
    }
    
    self.openInfoWindow = function (marker) {
        map.hideInfoWindows();
        (marker.mapMarker.infoWindow).open(marker.mapMarker.map, marker.mapMarker);
    };
    
    $.each('Pérola|Carris|bar'.split('|'), function (i, value) {
        foursquare( {query: value, radius: 200, limit: 50 }, self.getMarkers);
    });
};



// filter out the relevant info from a venue
function filterMarker(venue) {
    var marker = {};
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