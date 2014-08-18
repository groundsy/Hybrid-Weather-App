angular.module('starter.controllers', ['ionic']);
     // forecastio key constant
    app.constant('FORECASTIO_KEY', '7b814d57a09b4baf1651aa28333c3950');

    // weather controller
    app.controller('WeatherCtrl', function($scope,$state,Weather,DataStore) {
        // default city info
        $scope.city  = DataStore.city;
        $scope.state = DataStore.state;
        var latitude  = DataStore.latitude;
        var longitude = DataStore.longitude;
        $scope.iconSize = 150;
        $scope.futureIconSize = 50;

        // call getCurrentWeather method in factory ‘Weather’ to get current weather
        Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
            $scope.current = resp.data;
            $scope.daily = resp.data.daily;
            $scope.currentWeatherIcon = resp.data.currently.icon;
            $scope.todayWeatherIcon = resp.data.daily.data[0].icon;
            $scope.tomorrowWeatherIcon = resp.data.daily.data[1].icon;
            $scope.tempColor = setTempColor($scope.current.currently.temperature);
        }, function(error) {
            console.log("Error getting current weather conditions: " + error);
        });

        // set color of the temperature text. Based on the value of the temperature
        function setTempColor (temperature) {
            if (temperature >= 90){
                return "color:#FF0000"; //red
            }
            if (temperature >= 80) {
                return "color:#FF9900"; //orange
            }
            if (temperature >= 70) {
                return "color:#E6E600"; //yellow
            }
            if (temperature < 70) {
                return "color:#0000FF"; //blue
            }
        }
    });


    // Cities controller
    app.controller('CityCtrl', function($scope, $state, $rootScope, DataStore) {
        $scope.cities = [];
        var data = window.localStorage.getItem('cities');

        // try to use local storage
        if (data != null )  {
            $scope.cities   = null;
            $scope.cities   = JSON.parse(data);
            console.log("Using local storage");
        }
        // otherwise get city list from parse
        else {
            var city = Parse.Object.extend("City");
            var query = new Parse.Query(city);
            query.ascending("state"); // sort by state name
            query.find({
                success:function(results) {
                    console.log("Success in retrieving cities");
                    $scope.$apply(function() {
                        var index;
                        var Arrlen = results.length ;
                        for (index = 0; index < Arrlen; ++index) {
                            var city = results[index];
                            $scope.cities.push({
                                id : city.id,
                                name: city.attributes.name,
                                state: city.attributes.state,
                                lat: city.attributes.latitude,
                                lgn: city.attributes.longitude
                            });
                        }
                        // store parse results in local storage
                        window.localStorage.setItem('cities', JSON.stringify($scope.cities));
                    });
                },
                error:function(error) {
                    console.log("Error retrieving cities: " + error.message);
                }
            });
        }

        $scope.changeCity = function(cityId) {
            // get city data from local storage
            var data = JSON.parse(window.localStorage.getItem('cities'));

            var city = data[cityId].name; //city name
            var state= data[cityId].state; // state name
            var lat  = data[cityId].lat; //latitude
            var lgn  = data[cityId].lgn; //longitude

            // set the new city in the datastore
            DataStore.setCity(city);
            DataStore.setState(state);
            DataStore.setLatitude(lat);
            DataStore.setLongitude(lgn);

            // go to weather of the newly set city
            $state.go('tab.weather');
        }
    });


