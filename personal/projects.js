const express = require('express'),
    projectcontent = require("./content/projectinfo"),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('projects.html', {content : projectcontent});
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

router.get('/rpfp', function (req, res) {
    res.render('rpfp.html');
});

//  added 10/11/17
router.get('/raster', function (req, res) {
    res.render('raster.html');
});

module.exports = router;
