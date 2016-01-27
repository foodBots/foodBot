var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

module.exports = {

	retrieveSuggestedRecipes: function (req, res){

		// Get User ID & amt of recipes
		var uid = req.params.id;
		var amtOfRecipes = req.body.amount || 5;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Temporary Until Find A Better Way To Decide Which Meals To Send
		// var random = Math.floor(Math.random() * amtOfRecipes) + 1

		// Query allergies for User and Recipes
		var allergiesQuery = client.query("SELECT allergies FROM Profiles WHERE id = " + uid + "");
		var foodQuery = client.query("SELECT * FROM Recipes WHERE id <= " + amtOfRecipes + "");

		// Instantiate User Allergies Array & Results
		var userAllergies = [];
		var recipeResults = [];

		// On row add allergies recieved from db to userAllergies
		allergiesQuery.on("row", function (row) {
			userAllergies = row.allergies;
		});

		// On row add if no user allergies in recipe ingredients add recipe to results
		foodQuery.on("row", function (row) {
			var recipeIngredients = row.ingredients;
			if (recipeIngredients) {
				var allergyInFood =  recipeIngredients.some(function (food) {
					return userAllergies.indexOf(food) !== -1;
				});
				if (!allergyInFood) {
					recipeResults.push(row);
				}
			}
		});

		// After recieved all recipes return all which do not contain user allergies
		foodQuery.on("end", function () {
			var sendData = {recipes: recipeResults }
		    res.status(200).json(sendData);
		    client.end();
		});
	}

}
