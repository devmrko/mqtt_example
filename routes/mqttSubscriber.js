var express = require('express');
var router = express.Router();
var perPage = 5;
var url = require('url');

router.get('/', function (req, res, next) {
    res.render('mqttSubscriber', {
        "title": 'MQTT subscriber'
    });
});

router.post('/searchChartData', function (req, res, next) {
    res.jsonp({
        "chartDobj": req.mqttObj
    });
});

module.exports = router;