var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

require('./config/routes.js')(app, express);

var port = process.env.PORT || 8000;
app.listen(port);

module.exports = app;