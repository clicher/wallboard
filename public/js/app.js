'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
        'ngRoute',
        'myApp.controllers',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',

        // 3rd party dependencies
        'chart.js',
        'timer',
        'leaflet-directive'
    ]).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/map', {
                templateUrl: 'partials/map.html',
                controller: 'MyCtrl1',
                resolve: {
                    locations: function($q, $http) {
                        var deffered = $q.defer();
                        console.log('hi');
                        $http.get('/map/getMarkers').then(function (response) {
                            var resp = response.data;
                            console.log(resp.length);



                            deffered.resolve(resp);

                        });
                        return deffered.promise;
                    }
                }
            }).
            when('/rtStats', {
                templateUrl: 'partials/rtStats.html',
                controller: 'rtStatsController',
                resolve: {
                    agentInfo: function ($q, $http) {
                        var deffered = $q.defer();

                        $http.get('/rtStats/getAgentInfo').then(function (response) {
                            var resp = response.data;

                            var d = new Date().getTime();
                            angular.forEach(resp, function (value, index) {
                                value['time-in-status'] = d - (value['time-in-status'] * 1000);
                            })

                            deffered.resolve(resp);

                        });
                        return deffered.promise;
                    },
                    queueInfo: function ($q, $http) {
                        var deffered = $q.defer();

                        $http.get('/rtStats/getCurrentQueueInfo').then(function (response) {
                            var resp = response.data;
                            //console.log(resp);

                            deffered.resolve(resp);

                        });
                        return deffered.promise;
                    }
                }

            }).
            otherwise({
                redirectTo: '/rtStats'
            });
    });
