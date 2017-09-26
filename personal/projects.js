const express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('projects.html');
});

router.get('/attendance', function (req, res) {
    res.render('attendance.html')
});

router.get('/webdb', function (req, res) {
    res.render('webdb.html');
});

router.get('/home-server', function (req, res) {
    res.render('server.html');
});

module.exports = router;
