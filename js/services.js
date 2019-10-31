'use strict';

/* Services */

angular.module('myApp.services', [])
    .factory('RTQueue', ['$http', function($http) {
        var RTQueue = {
            async: function() {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get('/rtStats/getCurrentQueueInfo').then(function (response) {
                    var agentData = response.data;
                    return agentData;
                });
                // Return the promise to the controller
                return promise;
            }
        };
        return RTQueue;
    }])
    .factory('RTStats', ['$http', function($http) {
        var RTStats = {
            async: function() {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get('/rtStats/getAgentInfo').then(function (response) {
                    var agentData = response.data;
                    return agentData;
                });
                // Return the promise to the controller
                return promise;
            }
        };
        return RTStats;
    }])
    .factory('Maps', ['$http', function($http) {
        var Maps = {
            async: function() {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.get('http://localhost:3000/map/getMarkers').then(function (response) {
                    var agentData = response.data;
                    return agentData;
                });
                // Return the promise to the controller
                return promise;
            }
        };
        return Maps;
    }]);
