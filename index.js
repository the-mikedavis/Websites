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
    print('Redirect', 'to /home');
});

app.get('/home', function (req, res) {
    res.render('home.html')
    print('GET', 'home.html');
});

app.get('/data', function (req, res) {
    res.render('data.html')
    print('GET', 'data.html');
});

app.post('*', function(req, res) {
    print('POST', '*');
});

app.listen(80, function () {
    print('Server on-line', 'port 80');
});

function print (actionType, target) {
    console.log((new Date()).toString() + ' | ' +
            actionType + ' ' + target);
}
