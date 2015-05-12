$(function () {
  'use strict';

  var mapCenter = { lat: 38.706495,  lng: -9.156769 };
  
  var CLIENT_ID = '0NF4PAQ2Q0HIF2XYTB5ICX135ZMSLYJXSSG0AMCFTMDA0M1G';
  var CLIENT_SECRET = 'OJBZPIO4OQGKH3TP3BQUJJXCODPIVZAZEVMKLAWG1B1J2J5Z';
  var FSQR_URL = 'https://api.foursquare.com/v2/venues/search';

  // ?client_id=' +
  //                   CLIENT_ID + '&client_secret=' +
  //                   CLIENT_SECRET +
  //                   '&v=20150511' +
  //                   '&ll=' + mapCenter.lat + ',' + mapCenter.lng +
  //                   '&query=bar|cafe&radius=400&limit=50';

  var jsonData = {
    client_id : '0NF4PAQ2Q0HIF2XYTB5ICX135ZMSLYJXSSG0AMCFTMDA0M1G',
    client_secret : 'OJBZPIO4OQGKH3TP3BQUJJXCODPIVZAZEVMKLAWG1B1J2J5Z',
    v : '20150511',
    ll : $.map(mapCenter, function (value) { return value;}).join(','),
    radius : 1000,
    limit : 50,
    query: ''
  };

  // define a new map
  var map = new GMaps({
    div: '#map-canvas',
    center: mapCenter,
    zoom: 17
  });

  // call foursquare api around center
  $.getJSON(FSQR_URL, jsonData, function (result) {
    var meta = result.meta;
    var response = result.response;
    var venues = response.venues;
    var confident = response.confident;

    console.log(result, meta);
    console.log(response, confident);
    $.each(result.response.venues, function (key, value) {
      $("#marker-list").append('<a href="#" class="list-group-item"> \
                                <h4 class="list-group-item-heading">' +
                                value.name + '</h4> \
                                <p class="list-group-item-text">' +
                                value.location.formattedAddress[0] + '</p> \
                                </a>');
        map.addMarker({
          lat: value.location.lat,
          lng: value.location.lng,
          title: value.name,
          icon: {
            url: markerImg.greenDot
          },
          infoWindow: {
            content: '<p>' + value.name + '</p>'
          }
        });
      });
    });

  var marker = map.addMarker({
    position: mapCenter,
    title: 'Lisboa',
    icon: {
      url: markerImg.redDot
    },
    click: function(e) {
        this.setIcon(markerImg.blueDot);
    }
  });

} ());