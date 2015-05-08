function initialize() {
  var centerLatLng = new google.maps.LatLng( 38.7091743, -9.1534219);

  var mapOptions = {
    zoom: 15,
    center: centerLatLng
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var marker = new google.maps.Marker({
        position: centerLatLng,
        // map: map,
        title: 'Olá linda mulher, como chamas-te?!'
    });

  marker.setMap(map);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyACKHe_tyCZ23_CCyDDYnpy1zXxy11yUfM' +
       '&v=3.exp&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;
