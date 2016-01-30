var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');


var cooking = {
	1: 1800, // half hour in secs
	2: 3600, // hour in secs
	3: 7200 // two hour in secs
}
	getRecipesFromYummly = function (uid) {
		var client = new pg.Client(connectionString);
		client.connect();
		var yummlyRecipes;

		var foodQ = function (){
			return new Promise (function (resolve, reject) {
				var userCookingTime = client.query("SELECT cookingTime from Profiles WHERE id = '" + uid + "'", function (err, data){
					request("http://api.yummly.com/v1/api/recipes?_app_id=" + apiKeys.yummly_id +
					"&_app_key=" + apiKeys.yummly_key +
					"&requirePictures=true" +
					"&maxTotalTimeInSeconds=" + cooking[data.rows[0].cookingtime] +
					"&flavor.sweet.min=" + Math.random().toFixed(1) +
					"&flavor.piquant.min=" + Math.random().toFixed(1) +
					"&flavor.meaty.min=" + Math.random().toFixed(1) +
					"&flavor.sour.min=" + Math.random().toFixed(1) +
					"&flavor.bitter.min=" + Math.random().toFixed(1), function (error, response, body) {
						if (!error && response.statusCode == 200) {
							yummlyRecipes = body
							resolve(yummlyRecipes);
						}
					})

				});
			})
		}

		foodQ().then(function (yummlyRecipes){
			var insertRecipesIntoDB = function (){
				yummlyRecipes = JSON.parse(yummlyRecipes);
				yummlyRecipes.matches.forEach(function (recipe, index) {
					if (recipe.totalTimeInSeconds >= cooking[2]) {
						recipe.cookingTime = 3;
						console.log(recipe.cookingTime)
					} else if (recipe.totalTimeInSeconds >= cooking[1] && recipe.totalTimeInSeconds < cooking[2]) {
						recipe.cookingTime = 2;
						console.log(recipe.cookingTime)
					} else {
						recipe.cookingTime = 1;
						console.log(recipe.cookingTime)
					}

					// console.log("time: ",recipe.cookingtime)
					client.query("INSERT INTO Recipes (name, exactcookingtime, image, directionsUrl, cookingtime) VALUES ('" + recipe.recipeName + "', " + recipe.totalTimeInSeconds + ", '" + recipe.smallImageUrls[0] + "', 'http://www.yummly.com/recipe/external/" + recipe.id + "', '"+ recipe.cookingtime+"') ")

				})
			};

			insertRecipesIntoDB();

		})
	}

module.exports = {
	retrieveSuggestedRecipes: function (req, res) {
		var client = new pg.Client(connectionString);
		client.connect();
		// Get User ID & amt of recipes
		var uid = req.params.id;
		uid = parseInt(uid);
		var amtOfRecipes = req.body.amount || 10;

		console.log('getting recipes', uid)


		// Query allergies for User and Recipes
		console.log('type uid', typeof uid)
		var profileQuery = client.query("SELECT * FROM Profiles WHERE id = $1", [uid]);

		// Instantiate User Allergies Array & Results
		var userAllergies = [];
		var recipeResults = [];



		// On row add allergies recieved from db to userAllergies
		profileQuery.on("row", function (profileRow) {
			userAllergies = profileRow.allergies;
			var totalMatches = 0;
			var foodQuery = client.query("SELECT * FROM Recipes WHERE cookingtime = '" + profileRow.cookingtime + "'");
			// On row add if no user allergies in recipe ingredients add recipe to results
			foodQuery.on("row", function (foodRow) {
				var recipeIngredients = foodQuery.ingredients;

				if (amtOfRecipes > 0){
					recipeResults.push(foodRow);
					amtOfRecipes --;
				}
				totalMatches ++;
				// ALLERGIES:
				// if (recipeIngredients) {
				// 	var allergyInFood =  recipeIngredients.some(function (food) {
				// 		return userAllergies.indexOf(food) !== -1;
				// 	});
				// 	if (!allergyInFood) {
				// 		console.log("no allergies:", row)
				// 	}
				// }
			});

			foodQuery.on("end", function (){
				var sendData = {recipes: recipeResults }
				res.status(200).json(sendData);
				console.log("Sent to client")
				var lowOnViableRecipes = 50;
				if (totalMatches < lowOnViableRecipes) {
					client.end();
					getRecipesFromYummly(uid);
				}
			})
		})
	}
}
