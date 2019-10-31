var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;

var locationsSchema = new Schema({
    "trans-accept-time": { type: Date, required: true },
    origination: {type: String, required: true },
    location: { type: String, required: true},
    cord: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
});

var MapLocation = mongoose.model('MapLocation', locationsSchema);

module.exports = MapLocation;
