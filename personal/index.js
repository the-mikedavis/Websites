const express = require('express'),
    sites = require('./sites'),
    projects = require('./projects'),
    bs = require('./business'),
    knowledge = require('./knowledge'),
    games = require('./games'),
    url = require('url'),
    nun = require('nunjucks'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    //mongoose = require('mongoose'),
    app = express();

nun.configure('templates', {
    autoescape: true,
    express: app
});

//  route the example sites
app.use('/sites', sites);

//  route the project pages
app.use('/projects', projects);

//  route to the p5 games
app.use('/games', games);

//  route the business example site
app.use('/bs', bs);

//  serve the static files
app.use(express.static('static'));

//  serve the icon by absolute path
app.use(favicon(__dirname + '/favicon.ico'));

//  fix the ip address token in combined
morgan.token('ip', function (req, res) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
});

app.use(morgan(':ip - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

app.get('/', function (req, res) {
    res.render('me.html');
});

app.get('/language-graph', function (req, res) {
    res.render('languages.html');
});

app.get('/knowledge', function (req, res) {
    res.render('knowledge.html', {knowledge: knowledge});
});

app.listen(8080, function () {
    console.log('Server online at port 8080');
});
