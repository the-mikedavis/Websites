const express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('projects.html');
});

router.get('/attendance', function (req, res) {
    res.render('attendance.html')
});

module.exports = router;
