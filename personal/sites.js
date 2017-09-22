const express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('sites.html');
});

router.get('/home', function (req, res) {
    res.render('home.html')
});

router.get('/data', function (req, res) {
    res.render('data.html')
});

module.exports = router;
