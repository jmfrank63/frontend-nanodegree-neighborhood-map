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
}