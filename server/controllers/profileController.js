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
  addUserProfile: function() {
  	//on sign up

  },
  updateUserProfile: function(req, res, next) {
  	var prep = req.body.prep;
  	var budget = req.body.budget;
  	var type = req.body.type;
  	var userId = req.body.id;
  	var client = new pg.Client(connectionString);
  	client.connect();
  	var query = client.query("INSERT INTO Profiles (id, cookingTime, foodie, budget) VALUES ('"+userId+"','"+prep+"','"+type+"','"+budget"')");
  	query.on('end', function() {
  		client.end();
  	});
  	next(
  	// {
  	// 	id: userId,
  	// 	cookingTime: prep,
  	// 	foodie: type,
  	// 	budget: budget
  	// }
  	)
  },
  retrieveAllUsers: function(req, res, next) {
    console.log('logged in user!', req.session.user);
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
