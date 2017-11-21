const express = require('express'),
    aicontent = require("./content/ainfo"),
    router = express.Router();

router.get('/', function (req, res) {
    res.render('projects.html', {content : aicontent});
});

router.get('/uninformed', function (req, res) {
    res.render('ai.html', { mod : "uninformed", content : aicontent[0] });
});

router.get('/informed', function (req, res) {
    res.render('ai.html', { mod : "local", content : aicontent[1] });
});

router.get('/genetic', function (req, res) {
    res.render('ai.html', { mod : "genetic", content : aicontent[2] });
});

router.get('/csp', function (req, res) {
    res.render('ai.html', { mod : "csp", content: aicontent[3] });
});

router.get('/adversarial', function (req, res) {
    res.render('ai.html', { mod : "adversarial", content: aicontent[4] });
});

module.exports = router;
