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

	}
}