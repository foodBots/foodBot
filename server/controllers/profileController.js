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
  	var cookingTime = req.body.cookingTime;
  	var diet = req.body.diet.text;
  	var foodie = req.body.foodie;
  	var userId = req.params.id;
  	var client = new pg.Client(connectionString);
  	client.connect();
  	var query = client.query("INSERT INTO Profiles (id, cookingTime, foodie, diet) VALUES ('"+userId+"','"+cookingTime+"','"+!!foodie+"','"+diet+"')");
  	query.on('end', function() {
    res.status(200);
      client.end();
    });
  
  },
  updateUserProfile: function(req, res, next) {
  	var cookingTime = req.body.cookingTime;
  	var diet = req.body.diet.text;
  	var type = req.body.type;
  	var userId = req.params.id;
  	var client = new pg.Client(connectionString);
  	client.connect();
  	var query = client.query("INSERT INTO Profiles (id, cookingTime, foodie, diet) VALUES ('"+userId+"','"+cookingTime+"','"+type+"','"+diet+"')");
  	query.on('end', function() {
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
