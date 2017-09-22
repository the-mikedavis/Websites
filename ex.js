const express = require('express'),
    url = require('url'),
    nun = require('nunjucks'),
    favicon = require('serve-favicon'),
    app = express();

nun.configure('templates', {
    autoescape: true,
    express: app
});

app.use(express.static('static'));

app.use(favicon('favicon.ico'));

//middleware to print the date and action
app.use(function (req, res, next) {
    console.log((new Date()).toString(), req.method, req.url);
    next();
});

app.get('/', function (req, res) {
    res.redirect('/home');
});

app.get('/home', function (req, res) {
    res.render('home.html')
});

app.get('/data', function (req, res) {
    res.render('data.html')
});

app.listen(80, function () {
    console.log('Server on-line at port 80');
});
