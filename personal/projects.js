const express = require('express'),
    projectcontent = require("./content/projectinfo"),
    ai = require("./ai.js"),
    router = express.Router();

//  route to the ai router
//router.use('/ai', ai);

router.get('/', function (req, res) {
    res.render('projects.html', {content : projectcontent,
        pagetitle: "Projects" });
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

router.get('/poly', function (req, res) {
    res.render('rpfp.html');
});

//  added 10/11/17
router.get('/raster', function (req, res) {
    res.render('raster.html');
});

module.exports = router;
