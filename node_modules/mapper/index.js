var config                      = require('../../config');
var x8                          = require('./lib/8x8');
var areaCodeLookup              = require('./lib/areaCodeLookup');
var geocodeLookup               = require('./lib/geoCodeLookup');
var async                       = require('async');
var moment                      = require('moment');
/**
 * Database Information
 */
var mongoose                    = require('mongoose');
var Location                    = require('../../app/models/mapLocations');
var db                          = mongoose.connect('mongodb://localhost/wallboard').connection;

var lastDate;
backfill = false;


/**
 * Do some inital tasks before spawning the
 */
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    console.log('Database connection established!');
    console.log('===================================================');

    Location.find({}).sort({'trans-accept-time': 'desc'}).limit(1).exec(function(err, lastLocation) {
        if(err) {
            lastDate = new moment();
            return console.log(err);
        } else if ( lastLocation.length) {
            lastDate = new moment(lastLocation[0]['trans-accept-time']).format('YYYY-MM-DD');
        } else {
            lastDate = new moment();
        }

        console.log('Last Date in Database: ' + lastDate);
        console.log('===================================================');

        gatherDataLoop(function(err, d) {
            console.log(d)
            startTimer();
        });
    });
});

function startTimer() {

    setInterval(function() {
        gatherDataLoop(function(err, d) {
            if(err) {
                console.log(err);
            } else {
                console.log(d);
            }
        });
    }, 16000);
};

function gatherDataLoop(callback) {
    x8(lastDate, config.phoneSystemInformationForMap, backfill, function(err, d) {
        if(err) {
            callback(err);
            return;
        };
        findIfExists(d, function(err, da) {
            console.log(da);
            backfill = true;
            if(da.length == 0) {
                callback(null, 'NOCHANGES');
                return;
            }
            areaCodeLookup(da, config.areaCodeApiInformationForMap, function(err, dat) {
                if(dat == 'NOVALIDNUMBERS') {
                    callback(null, 'NOVALIDNUMBERS');
                    return;
                }
                geocodeLookup(dat, null, function(err, data) {
                    bulkUpdateDb(data, function() {
                        callback(null, 'FINAL');
                    })
                })
            })
        })
    });
};

function bulkUpdateDb(dat, callback) {

    async.eachSeries(dat, function(l, cb) {
        var query = { 'trans-accept-time': l['trans-accept-time'], 'origination':  l['origination'] };
        var location = new Location(l);
        Location.findOneAndUpdate(query, { $set: location }, { upsert: true }, function(err, loc) {
            console.log(loc);
            cb();
        });
    }, function(err) {
        callback(dat);
    })
};

function findIfExists(dat, callback) {

    async.filterSeries(dat, function(l, cb) {
        var query = { 'trans-accept-time': l['trans-accept-time'], 'origination':  l['origination'] };
        Location.findOne(query, function(err, locationFound) {
            if (err) {
                console.log("MongoDB Error: " + err);
                cb(err);
                return;
            } else {
                if(!locationFound) {
                    cb(null, l);
                    return;
                } else {
                    cb(null, !l);
                }
            }
        })
    }, function(err, data) {
        if(err) {
            callback(err);
            return;
        };
        callback(null, data);
    })
};
