const express = require('express'),
    aicontent = require("./content/ainfo"),
    marked = require('marked'),
    fs = require('fs'),
    router = express.Router();

const pathnames = [
    "uninformed",
    "local",
    "genetic",
    "csp",
    "adversarial"
];
for (let i = 0; i < aicontent.length; i++)
    aicontent[i].context = marked(fs.readFileSync(__dirname +
        '/static/dist/aiwalkthrough/src/' + pathnames[i] + '/README.md', 
        "utf8"));

router.get('/', function (req, res) {
    res.render('projects.html', {content : aicontent, pagetitle: "AI" });
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
