var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

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
  addUserProfile: function(req, res, next) {
  	//on sign up
<<<<<<< 9e0e160c88f7e06dfc6e95f0271eda3b8c1709e9
    var cookingTime = req.body.cookingTime;
    var diet = req.body.diet.text;
<<<<<<< 410abbd44c2c20634f4d2c6799d9ca0b8689996b

    var foodie = req.body.foodie;
    var userId = req.params.id;
    var client = new pg.Client(connectionString);

    console.log('ADD USER PROFILE', userId, cookingTime, diet, foodie);
=======
    var foodie = (req.body.foodie === 'true');
    var userId = req.params.id; 
=======
    console.log('ADD USER PROFILE');
  	var cookingTime = req.body.cookingTime;
  	var diet = req.body.diet;
  	var foodie = req.body.foodie;
  	var userId = req.params.id;
>>>>>>> refactoring $ logic and writing gets
  	var client = new pg.Client(connectionString);
>>>>>>> refactoring $ logic and writing gets
  	client.connect();
    var updateOrNewQuery = client.query("SELECT match FROM Profiles WHERE id='"+userId+"';", function(err, data) {
      if (data.rowCount > 0) {
        var updateQuery = client.query("UPDATE Profiles SET (cookingTime, foodie, diet) = ("+cookingTime+","+foodie+",'"+diet+"') WHERE id = "+userId+";", function(err, data) {
        });
        res.status(201);
      } else {
  	   var newQuery = client.query("INSERT INTO Profiles (id, cookingTime, foodie, diet) VALUES ('"+userId+"','"+cookingTime+"','"+!!foodie+"','"+diet+"')");
       res.status(200);
      }
    });
  	updateOrNewQuery.on('end', function() {
      console.log('ended?');
      res.status(200).json(userId);
      client.end();
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
