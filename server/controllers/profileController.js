var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

module.exports = {

	retrieveUserMeals : function (req, res){
		// Get User ID
		var uid = req.params.id;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Query for all recipes user has created or eaten
		var userRecipesQuery = client.query("SELECT * FROM UserRecipes WHERE profileid = " + uid + "") ;

		// Instantiate User Recipes
		var userRecipes = [];

		// Push all db userRecipes to userRecipes Array
		userRecipesQuery.on("row", function (row) {
			userRecipes.push(row);
		});

		// After recieved all User Recipes
		userRecipesQuery.on("end", function () {

			// Instantiate Created and Eaten Array
			var created = [];
			var eaten = [];

			// Sort All Recipes By Eaten & Created
			userRecipes.forEach(function (recipe){
				
				if (recipe.created){
					created.push(recipe)
				}
				else {
					eaten.push(recipe)
				}
			})

			// Send userRecipes to Client
			var sendData = {created: created, eaten: eaten }
			res.send(sendData);
		});

	},

	addUserMeal : function (req, res){

		// Get Client Data
		var uid = req.params.id;
		var recipeAdded = req.body.mealID;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Insert Meal Query 
		var addUserRecipeQuery = client.query("INSERT INTO userRecipes (profileid, recipeid, created) VALUES (" + uid + "," + recipeAdded + ", false)") ;
		//TODO: MAKE RESTRAINT TO NOT ALLOW DUPLICATES

		// After Added Send Client 200 Status Code
		addUserRecipeQuery.on("end", function (){
			res.sendStatus(200);
		})
		res.sendStatus(409)

	},
  retrieveOneUser: function(req, res, next) {
    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.body.id;
    var query = client.query('SELECT NAME, RESTRICTIONS, ALLERGIES, BUDGET, MATCH FROM Users INNER JOIN Users ON'+userId+'= Profiles.ID;')
    query.on('row', function(userData) {
      res.status(200).json(userData);
    });
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
