var path = require('path');
var express = require('express');

//Extras
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./server/config/dbOperations.js');
var User = require('./server/controllers/userController.js');

//Webpack
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/../client'));

require('./server/config/routes.js')(app, express);

var port = process.env.PORT || 3000;

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});

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

