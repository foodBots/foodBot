var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');
var helper = require('../config/helpers.js');

var cooking = {
	1: 600, // half hour in secs
	2: 1800, // hour in secs
	3: 3600 // two hour in secs
}

	// getRecipesFromEdaman = function (){
	// 	request("https://api.edamam.com/search?&&app_id=" + apiKeys.edamam.id + "&app_key=" + apiKeys.edamam.key + "", function (err, data){
	// 		console.log(JSON.parse(data.body).hits)
	// 	})
	// }

	getRecipesFromYummly = function (uid) {
		var client = new pg.Client(connectionString);
		client.connect();
		var yummlyRecipes;
		console.log("in yummly",uid)

		var foodQ = function (){
			return new Promise (function (resolve, reject) {
				var start;
				var startQuery = client.query("SELECT Count(*) FROM recipes WHERE sourceid=1", function (err, result){
					start = parseInt(result.rows[0].count) + 2;

				})
				startQuery.on("end", function (){
					var userCookingTime = client.query("SELECT cookingTime from Profiles WHERE id = '" + uid + "'", function (err, data){
						request("http://api.yummly.com/v1/api/recipes?_app_id=" + apiKeys.yummly.id +
						"&_app_key=" + apiKeys.yummly.key +
						"&requirePictures=true" +
						"&maxTotalTimeInSeconds=" + cooking[data.rows[0].cookingtime] +
						"&excludedCourse[]=course^course-Breads" +
						"&excludedCourse[]=course^course-Beverages" +
						"&excludedCourse[]=course^course-Condiments and Sauces" +
						"&excludedCourse[]=course^course-Cocktails" + 
						"&maxResult=10" +
						"&start=" + start
						, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								yummlyRecipes = body
								console.log("result:", yummlyRecipes)
								resolve(yummlyRecipes);
							}
						})

					});
				})
			})
		}

		foodQ().then(function (yummlyRecipes) {
			console.log("about to insert into db")
			var insertRecipesIntoDB = function () {
				yummlyRecipes = JSON.parse(yummlyRecipes);
					// var ingredients = helper.scrapeIngredients("http://www.yummly.com/recipe/external/Black-Bean-_-Corn-Salsa-673549");
				yummlyRecipes.matches.forEach(function (recipe, index) {
					if (recipe.totalTimeInSeconds >= cooking[2]) {
						recipe.cookingTime = 3;
					} else if (recipe.totalTimeInSeconds >= cooking[1] && recipe.totalTimeInSeconds < cooking[2]) {
						recipe.cookingTime = 2;
					} else {
						recipe.cookingTime = 1;
					}
					var recipeImg = recipe.smallImageUrls ? recipe.smallImageUrls[0] + "0-c": recipe.imageUrlsBySize[Object.keys(recipe.imageUrlsBySize)[0]].replace("90","900")
					client.query("INSERT INTO Recipes (name, exactcookingtime, image, directionsUrl, cookingtime, recipesourceid, rating, sourceid) VALUES ('" + recipe.recipeName + "', " + recipe.totalTimeInSeconds + ", '" + recipeImg + "0-c', 'http://www.yummly.com/recipe/external/" + recipe.id + "', " + recipe.cookingTime + ", '" + recipe.id + "', " + recipe.rating + ", 1) " , function (err) {
						if (err){
							console.log("yummly recipe already saved in db")
						}
						console.log("added recipe to database")
					})
				})

			};
			insertRecipesIntoDB();
		});
	}


module.exports = {
	retrieveSuggestedRecipes: function (req, res) {
	console.log("retrieveSuggestedRecipes")
		var client = new pg.Client(connectionString);
		client.connect();
		// Get User ID & amt of recipes
		var uid = parseInt(req.params.id);
		var amtOfRecipes = req.body.amount || 20;

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
			// SELECT * FROM Recipes WHERE (Recipes.id) NOT IN ( SELECT recipeid FROM userRecipes WHERE profileid = 1 ) AND (cookingtime = profileRow.cookingtime OR cookingtime = (profileRow.cookingtime - 1)

			var foodQuery = client.query("SELECT * FROM Recipes WHERE (Recipes.id) NOT IN ( SELECT recipeid FROM userRecipes WHERE profileid = " + uid + ") AND (cookingtime = " +  profileRow.cookingtime + " OR cookingtime = " + (profileRow.cookingtime - 1) + " OR cookingtime IS NULL)" );
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
				// console.log("sending this thingy:",sendData)
				res.status(200).json(sendData);
				var lowOnViableRecipes = 50;
				console.log("getting from yummly")
				if (totalMatches < lowOnViableRecipes) {
					client.end();
					getRecipesFromYummly(uid);
					// getRecipesFromEdaman();
				}
			})
		})
	}
}
