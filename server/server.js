var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./config/dbOperations.js');


var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/../client'));

// require('./config/routes.js')(app, express);

// var port = process.env.PORT || 8000;
// app.listen(port);

//postgres set up
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client = new pg.Client(connectionString);

client.connect();
var createUserTable = client.query(db.createUserTable);
createUserTable.on('end', function() { client.end(); });

var client = new pg.Client(connectionString);
client.connect();
var createProfileTable = client.query(db.createProfileTable);
createProfileTable.on('end', function() { client.end(); });

var client = new pg.Client(connectionString);
client.connect();
var createRecipeTable = client.query(db.createRecipeTable);
createRecipeTable.on('end', function() { client.end(); });
// query.on("error", function (error) {
//     console.log('error in query', error);
// });
// query.on("row", function (row, result) {
//     console.log('adding row in query')
//     result.addRow(row);
// });


console.log('Listening...');

module.exports = app;