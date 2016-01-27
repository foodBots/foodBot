var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./config/dbOperations.js');
var User = require('./controllers/userController.js');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/../build'));

require('./config/routes.js')(app, express);

var port = process.env.PORT || 8000;
app.listen(port);

//postgres set up
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost/foodbot';

var client = new pg.Client(connectionString);
client.connect();

//create db tables

var createUsersTable = client.query(db.createUsersTable);
var createRecipesTable = client.query(db.createRecipesTable);
var createProfilesTable = client.query(db.createProfilesTable);
var createUserRecipesTable = client.query(db.createUserRecipesTable);


module.exports = app;