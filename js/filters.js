'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('interpolate',function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }).
    filter('getByName', function () {
        return function (input, name) {
            for (var i = 0; i < input.length; i++) {
                if (input[i]['agent-name'] == name) {
                    return i;
                };
            };
            return false;
        };
    }).
    filter('getByQueue', function() {
        return function (input, name) {
            for (var i = 0; i < input.length; i++) {
                if (input[i]['queue-name'] == name) {
                    return i;
                };
            };
            return false;
        };
    }).
    filter('removeArrayOfQueues', function () {
        return function(input, keyArray) {
            var newArray = [];
            for (var j = 0; j < keyArray.length; j++) {
                for (var i = 0; i < input.length; i++) {
                    if (input[i]["queue-name"] !== keyArray[j]) {
                        newArray.push(input[i]);
                    };
                };
            };
            return newArray;
        };
    });
