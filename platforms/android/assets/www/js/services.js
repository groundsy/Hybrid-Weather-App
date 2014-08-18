// set up the api call to forecastio
var forecastioWeather = ['$q', '$resource', '$http', 'FORECASTIO_KEY',
    function($q, $resource, $http, FORECASTIO_KEY) {
        var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';

        var weatherResource = $resource(url, {
            callback: 'JSON_CALLBACK',
        }, {
            get: {
                method: 'JSONP'
            }
        });

        return {
            getCurrentWeather: function(lat, lng) {
                return $http.jsonp(url + lat + ',' + lng + '?callback=JSON_CALLBACK');
            }
        }
    }];

angular.module('starter.services', ['ngResource'])
    // weather service using the forecastio api call defined above
    .factory('Weather', forecastioWeather)

    // datastore service. holds city information for the default or selected city
    .factory('DataStore', function() {
        var DataStore = {
            city:       'Miami',
            state:      'Florida',
            latitude:   25.7877,
            longitude:  80.2241 };

        DataStore.setCity = function (value) {
            DataStore.city = value;
        };

        DataStore.setLatitude = function (value) {
            DataStore.longitude = value;
        };

        DataStore.setLongitude = function (value) {
            DataStore.longitude = value;
        };

        DataStore.setState = function (value) {
            DataStore.state = value;
        };

        return DataStore;
    });



