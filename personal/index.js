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
    res.redirect('/me');
    print('Redirect', 'to home');
});

app.get('/me', function (req, res) {
    res.render('home.html');
    print('GET', '/me');
});

app.get('/projects', function (req, res) {
    res.render('projects.html');
    print('GET', '/projects');
});

app.listen(3000, function () {
    print('Server online', 'at port 3000');
});

function print (action, target) {
    console.log((new Date()).toString() + ' | ' +
        action + ' ' + target);
}
