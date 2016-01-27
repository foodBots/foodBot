var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

module.exports = {
  signup: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query("INSERT INTO Users (password, email) VALUES (crypt('"+req.body.password+"', gen_salt('bf', 8)),'"+req.body.email+"');");
    // currently not rejecting signup attempts for existing users, instead creates new items if email already exists
    query.on('end', function(results) {
      res.send(201);
      client.end();
    });
  }, 
  retrieveOneUser: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query("SELECT * FROM Users WHERE id = "+req.params.id+";");
    query.on('row', function(data) {
      res.status(200).json(data);
    });
    query.on('end', function() {
      //if no id  was found and res.status was not set, declare error to client
      res.status(400).json("USER does not exist");
      client.end();
    }); 
  },
  retrieveAllUsers: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var allUsers = [];
    var query = client.query("SELECT * FROM Users;");
    //collect all users in database
     query.on('row', function(data) {
      allUsers.push(data);
    });
    query.on('end', function() {
      res.status(201).json(allUsers);
      client.end();
    });
  },
  signin: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query("SELECT * FROM Users where email ='"+req.body.email+"' AND password = crypt('"+req.body.password+"', password);", function(err, data) {
      if (err) {
        res.status(500).json("We're sorry, an error has occurred");
      } else if (data.rows.length < 1) {
        res.status(400).json("Username or password is incorrect");
      } else {
        res.status(201).json("Sign in successful");
      }
    });
    query.on('end', function() {
      client.end();
    });
  }
}

//)