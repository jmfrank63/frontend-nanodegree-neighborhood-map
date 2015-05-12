/* Map view model
 * contains knockout observables
 * holding places
 */

var markerViewModel = {
    markers : ko.observableArray()
};

foursquare({query: 'carris c', radius: 100}, function(result) {
        venues = result.response.venues;
        $.each(venues, function (key, value) {
            var marker = {};
            console.log(value);
            marker.name = value.name;
            if (value.categories.length > 0) {
                marker.category = value.categories[0].name;
            }
            else {
                marker.category = ''
            }
            markerViewModel.markers.push(marker);
        });
        console.log(markerViewModel.markers());
    });
    
ko.applyBindings(markerViewModel);