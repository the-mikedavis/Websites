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

app.get('/', function (req, res) {
    res.redirect('/home');
    console.log('Redirect to home');
});

app.get('/home', function (req, res) {
    res.render('home.html')
    console.log('GET home.html');
});

app.get('/data', function (req, res) {
    res.render('data.html')
    console.log('GET data.html');
});

app.post('*', function(req, res) {
    console.log('POST');
});

app.listen(80, function () {
    console.log('Server on-line');
});
