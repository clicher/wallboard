var express                     = require('express');
var router                      = express.Router();
var worker                      = require('child_process').fork('./node_modules/rtStats/index');
var _                           = require('underscore');

var agent = [];
var queue = [];

worker.on('message', function(m) {
    // Receive results from child process
    if(m['agent']) {
        agent = m['agent'];
    } else if(m['queue']) {
        queue = m['queue'];
    };
});

router.get('/getAgentInfo', function (req, res, next) {

    //res.send(_.filter(agent, function(a) { return a['agent-status'] != 9 }));
    res.send(agent);
});

router.get('/getCurrentQueueInfo', function (req, res) {

    res.send(queue);
});


module.exports = router;
