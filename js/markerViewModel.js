/* Map view model
 * contains knockout observables
 * holding places
 */

function markerViewModel () {
    var self = this;
    self.pool = [];
    self.title = ko.observable('Neighborhood Map');
    self.keep = ko.observable(false);
    self.radius = ko.observable(200);
    self.limit = ko.observable(50);
    self.markers = ko.observableArray();
    self.search = ko.observable('');
    self.filter = ko.observable('');

    // function to be called on submit filter
    self.submitFilter = function (formElement) {
        var markers = [];
        var filterString = self.filter().split('|');
        self.markers([]);
        $.each(filterString, function (i, filter) {
                $.extend(markers, $.grep(self.pool, function(elem) {
                    console.log(filter.toLowerCase());
                    return (elem.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
                }, false));
        });
        ko.utils.arrayPushAll(self.markers(), markers);
        self.markers.valueHasMutated();
        self.drawMarkers(self.markers());
    };

    // function to be called on submit search
    self.submitSearch = function (formElement) {
        var queryString = self.search().split('|');
        console.log(self.keep());
        if(!self.keep()) {
            self.markers([]);
            self.pool = [];
            map.removeMarkers();
        }
        // call the foursquare api with supplied queries
        $.each(queryString, function (i, value) {
            foursquare( {query: value, radius: self.radius(), limit: self.limit() }, self.getMarkers);
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
    
    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });

    $.each('Pérola|Carris|bar'.split('|'), function (i, value) {
        foursquare( {query: value, radius: 200, limit: 50 }, self.getMarkers);
    });
};



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