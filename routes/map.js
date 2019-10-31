'use strict';

var express                     = require('express');
var config                      = require('../config');
var router                      = express.Router();
var worker                      = require('child_process').fork('./node_modules/mapper/index');
var moment                      = require('moment');
var _                           = require('underscore');

var mongoose                    = require('mongoose');
var Location                    = require('../app/models/mapLocations');
var db                          = mongoose.connect('mongodb://localhost/wallboard').connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('DATABASE OPENED IN MAP.js');
});


router.get('/getMarkers', function(req, res) {
    Location.find({}, { '_id': 0, 'trans-accept-time': 1, 'origination': 1, 'cord': 1 }).sort({'trans-accept-time': 'desc'}).exec(function(err, lastLocation) {
        var toSend = {};
        for(var i = 0; i < lastLocation.length; i++) {
            var title = new moment(lastLocation[i]['trans-accept-time']).format('YYMMDDHHmmss');

            _.each(toSend, function(value, key){
                if( value['lat'] == lastLocation[i]['cord']['lat'] && value['lng'] == lastLocation[i]['cord']['lng']) {
                    var num = Math.random() * (0.220 - 0.0400) + 0.0300;
                    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                    var num2 = Math.random() * (0.120 - 0.0200) + 0.0200;
                    num2 *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                    lastLocation[i]['cord']['lat'] += num;
                    lastLocation[i]['cord']['lng'] += num2;

                }
            });
            toSend[title] = {
                lat: lastLocation[i]['cord']['lat'],
                lng: lastLocation[i]['cord']['lng']
            };
        }
        res.send(toSend);
    });

});

/* GET map listing. */
router.get('/', function(req, res, next) {
    res.send(mapper.mapdata);
});

module.exports = router;
