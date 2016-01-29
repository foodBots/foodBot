var path = require('path');
var express = require('express');
var session = require('express-session');

//Extras
var bodyParser = require('body-parser');
var db = require('./server/config/dbOperations.js');
var User = require('./server/controllers/userController.js');

//Webpack
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var compiler = webpack(config);

var app = express();

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'FOOD1234567890BOT',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//Hot Reloading
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/../client'));

require('./server/config/routes.js')(app, express);

var port = process.env.PORT || 3000;

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, function(err) {
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
var createMatchesQueueTable = client.query(db.createMatchesQueueTable);

module.exports = app;
