const express = require('express'),
    url = require('url'),
    nun = require('nunjucks'),
    favicon = require('serve-favicon'),
    app = express(),
    sites = express.Router();

nun.configure('templates', {
    autoescape: true,
    express: app
});

//  serve the static files
app.use(express.static('static'));

//  serve the icon
app.use(favicon('favicon.ico'));

//  middleware to print activity
app.use(function (req, res, next) {
    console.log((new Date()).toString(), req.method, req.url);
    next();
});

app.get('/', function (req, res) {
    res.redirect('/me');
});

app.get('/me', function (req, res) {
    res.render('me.html');
});

app.get('/projects', function (req, res) {
    res.render('projects.html');
});

app.get('/sites', function (req, res) {
    res.render('sites.html');
});

app.listen(3000, function () {
    console.log('Server online at port 3000');
});
