const express = require('express'),
    aicontent = require("./content/ainfo"),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('projects.html', {content : aicontent});
});

router.get('/uninformed', function (req, res) {
    res.render('ai.html', { mod : null });
});

router.get('/informed', function (req, res) {
    res.render('ai.html', { mod : null });
});

router.get('/genetic', function (req, res) {
    res.render('ai.html', { mod : null });
});

router.get('/csp', function (req, res) {
    res.render('ai.html', { mod : null });
});

router.get('/adversarial', function (req, res) {
    res.render('ai.html', { mod : null });
});

module.exports = router;
