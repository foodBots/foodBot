var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var request = require('request');
var apiKeys = require('../config/apiKeys');

module.exports = {

	retrieveSuggestedRecipes: function (req, res){

		// Get User ID & amt of recipes
		var uid = req.params.id;
		var amtOfRecipes = req.body.amount || 5;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// var cooking = {
		// 	1: 1800, // half hour in secs
		// 	2: 3600, // hour in secs
		// 	3: 7200 // two hour in secs
		// }

		// var userCookingTime = client.query("SELECT cookingTime from Profiles WHERE id = '" + uid + "'", function (err, data){
		// 	request("http://api.yummly.com/v1/api/recipes?_app_id=" + apiKeys.yummly_id + "&_app_key=" + apiKeys.yummly_key + "&requirePictures=true&maxTotalTimeInSeconds=" + cooking[data.rows[0].cookingtime] + "" , function (error, response, body) {
		// 		if (!error && response.statusCode == 200) {
		// 			console.log(body) // Show the HTML for the Google homepage. 
		// 		}
		// 	})
		// });



		

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
