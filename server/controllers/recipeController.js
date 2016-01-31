var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');


var cooking = {
	1: 600, // half hour in secs
	2: 1800, // hour in secs
	3: 3600 // two hour in secs
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

		foodQ().then(function (yummlyRecipes) {
			var insertRecipesIntoDB = function () {
				yummlyRecipes = JSON.parse(yummlyRecipes);
				yummlyRecipes.matches.forEach(function (recipe, index) {
					if (recipe.totalTimeInSeconds >= cooking[2]) {
						recipe.cookingTime = 3;
					} else if (recipe.totalTimeInSeconds >= cooking[1] && recipe.totalTimeInSeconds < cooking[2]) {
						recipe.cookingTime = 2;
					} else {
						recipe.cookingTime = 1;
					}
					client.query("INSERT INTO Recipes (name, exactcookingtime, image, directionsUrl, cookingtime, yummly_id, rating) VALUES ('" + recipe.recipeName + "', " + recipe.totalTimeInSeconds + ", '" + recipe.smallImageUrls[0] + "0-c', 'http://www.yummly.com/recipe/external/" + recipe.id + "', " + recipe.cookingTime + ", '" + recipe.id + "', " + recipe.rating + ") " , function (err) {
						if (err){
							console.log("yummly recipe already saved in db")
						}
					})
				})

			};
			insertRecipesIntoDB();
		});
	}

module.exports = {
	retrieveSuggestedRecipes: function (req, res) {
		var client = new pg.Client(connectionString);
		client.connect();
		// Get User ID & amt of recipes
		var uid = parseInt(req.params.id);

		var amtOfRecipes = req.body.amount || 10;

		// Query allergies for User and Recipes
		var profileQuery = client.query("SELECT * FROM Profiles WHERE id = " + uid + "", function (err, result){
			if (err) {
				console.log(err)
			}
			// console.log("THIS:",result)
		});

		// Instantiate User Allergies Array & Results
		var userAllergies = [];
		var recipeResults = [];

		// On row add allergies recieved from db to userAllergies
		profileQuery.on("row", function (profileRow) {
			userAllergies = profileRow.allergies;
			var totalMatches = 0;
			var foodQuery = client.query("SELECT * FROM Recipes WHERE cookingtime = " +  profileRow.cookingtime +" AND (Recipes.id) NOT IN ( SELECT recipeid FROM userRecipes WHERE profileid = " + uid + ")");
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
				var lowOnViableRecipes = 50;
				if (totalMatches < lowOnViableRecipes) {
					client.end();
					getRecipesFromYummly(uid);
				}
			})
		})
	}
}
