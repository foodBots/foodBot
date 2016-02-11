var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var auth = require('../config/authOperations.js');

module.exports = {

  retrieveOneUser: function(req, res, next) {
    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.body.id;
    var query = client.query('SELECT NAME, RESTRICTIONS, ALLERGIES, BUDGET, MATCH FROM Profiles INNER JOIN Users ON'+userId+'= Profiles.ID;')
    query.on('row', function(userData) {
      res.status(200).json(userData);
    });
    query.on('end', function() {
      client.end();
    });
  },
  updateUserProfile: function(req, res, next) {
    var userId = parseInt(req.params.id);
    var cookingTime = parseInt(req.body.cookingTime);
    var diet = req.body.diet.text;
    var foodie = (req.body.foodie === "true");
    var allergies = req.body.allergies;
    var client = new pg.Client(connectionString);

    client.connect();

    var updateQuery = client.query("UPDATE Profiles SET (cookingTime, foodie, diet) = ("+cookingTime+","+foodie+",'"+diet+"') WHERE id = "+userId+";", function(err, data) {
      console.log("update querrrry", data, 'error', err)
      if (err) {
        res.sendStatus(403);
      }
      res.status(201).json(userId);
    });
    updateQuery.on('end', function() {
      console.log('ended update');
      //next();
      client.end();
    });
  },

  addUserProfile: function(req, res, next) {
    //on sign up
    var cookingTime = parseInt(req.body.cookingTime);
    var diet = req.body.diet.text;
    var foodie = (req.body.foodie === "true");
    console.log('1. FOODIE BEFORE:', req.body.foodie, 'FOODIE AFTER:', foodie);
    var userId = parseInt(req.params.id);
    var allergies = req.body.allergies;
    var client = new pg.Client(connectionString);
    console.log('userID',userId);
    var userData = {
      id: userId
    };

    client.connect();
    var updateOrNewQuery = client.query("SELECT * FROM Profiles WHERE id='"+userId+"';", function(err, data) {
      if (data.rowCount > 0) {
        var updateQuery = client.query("UPDATE Profiles SET (cookingTime, foodie, diet) = ("+cookingTime+","+foodie+",'"+diet+"') WHERE id = "+userId+";", function(err, data) {
        console.log("update querrrry", data)
      });
      res.sendStatus(201);
      } else {
        var newQuery = client.query("INSERT INTO Profiles (id, cookingTime, allergies, foodie, diet) VALUES ("+userId+","+cookingTime+",'{"+allergies+"}',"+foodie+",'"+diet+"')", function(err, data) {
          if (err) {
            console.log('error inserting profile', err);
            res.sendStatus(403);
          }
          console.log("Inserting new profile", data);
          // res.sendStatus(201);
        });
        newQuery.on('end', function() {
          console.log('inserting profile query ended, should redirect now');
          auth.createSession(req, res, userData);
          res.status(201).json(userData);
          client.end();
          // next();
          // res.redirect('/');
        });
      }
    });
    updateOrNewQuery.on('end', function() {
      console.log('add user profile ended');
      // next();
      client.end();
      // res.sendStatus(201);
    });
  },
  storeProfile: function(profile, cb) {
    var client = new pg.Client(connectionString);
    client.connect();
    var updateOrNewQuery = client.query("SELECT * FROM Profiles WHERE id='"+profile.id+"';", function(err, data) {
      if (data.rowCount > 0) {
        console.log("profile exists", data);
        client.end();
      } else {
        var newQuery = client.query("INSERT INTO Profiles (id, name, foodie) VALUES ("+profile.id+",'"+profile.userData.name+"',true)", function(err, data) {
          if (err) {
            console.log('error store profile', err);
            // res.sendStatus(403);
            client.end();
          }
          console.log("stored new profile", data);
          // res.sendStatus(201);
          client.end();
        });
      }
    });
  },
  retrieveAllUsers: function(req, res, next) {
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query('SELECT * FROM Profiles;');
    query.on('row', function(allUserData) {
      res.status(200).json(allUserData);
    });
    query.on('end', function() {
      client.end();
    });
  }
};

