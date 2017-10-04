const express = require('express'),
    sites = require('./sites'),
    projects = require('./projects'),
    knowledge = require('./knowledge'),
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

//  sort all the knowledge arrays
for (let arr in knowledge)
    knowledge[arr] = knowledge[arr].sort();

/*
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/traffic');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('Connected to the traffic DB.');
});

const trafficSchema = mongoose.Schema({
    ip: String,
    date: String,
    method: String,
    url: String,
    httpVersion: Number,
    status: String,
    referrer: String,
    userAgent: String
}),
    Traffic = mongoose.model('Traffic', trafficSchema);
*/

//  route the example sites
app.use('/sites', sites);

//  route the project pages
app.use('/projects', projects);

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

/*
//  write the traffic to the database
app.use(function (req, res, next) {
    const ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    //  methods to get values borrowed from morgan (npm module)
    const t = new Traffic({
        ip: ip,
        date: (new Date()).toUTCString(),
        method: req.method,
        url: req.originalUrl || req.url,
        httpVersion: Number(req.httpVersionMajor + '.' + req.httpVersionMinor),
        status: res._header ? String(res.statusCode) : undefined,
        referrer: req.headers['referer'] || req.headers['referrer'],
        userAgent: req.headers['user-agent']
    });

    t.save().catch(err => console.log('Failed to save to database'));

    next();
});
*/

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
