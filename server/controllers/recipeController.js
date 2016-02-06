var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');
var priceController = require('./priceController');
var parseString = require('xml2js').parseString;


var client = new pg.Client(connectionString);

var cooking = {
	1: 600, // half hour in secs
	2: 1800, // hour in secs
	3: 3600 // two hour in secs
}
var pageNumber = 1;
var pickNumber = 1;
	// getRecipesFromEdaman = function (){
	// 	request("https://api.edamam.com/search?&&app_id=" + apiKeys.edamam.id + "&app_key=" + apiKeys.edamam.key + "", function (err, data){
	// 		console.log(JSON.parse(data.body).hits)
	// 	})
	// }


	getRecipesFromYummly = function (uid) {
		client.connect();
		var yummlyRecipes;
		console.log("in yummly",uid)

		var foodQ = function (){
			return new Promise (function (resolve, reject) {
				var start = 0;
				var startQuery = client.query("SELECT Count(*) FROM recipes WHERE sourceid=1", function (err, result){
					if (result) {
						start = parseInt(result.rows[0].count) + 2;
					}
					console.log("start: ", start)

				})
				startQuery.on("end", function (){
					// var userCookingTime = client.query("SELECT cookingTime from Profiles WHERE id = '" + uid + "'", function (err, data) {
						client.query('SELECT name from RecipeSearchTerms WHERE id = ' + pickNumber + ' ', function (err, result) {
							var foodName = result.rows[0].name;
								// console.log("foeaching:", row)
								request("https://api.edamam.com/search?q=" + foodName + "&from=10&to=20&app_id=21198cff&app_key=a70d395eb9f3cf9dae36fb4b5e638958", function (err, response, body) {
									if (err) {console.log('Error in request to edemam', err);} 
									else {
										resolve(JSON.parse(response.body).hits)
									}
									// console.log(JSON.parse(response.body).hits)
									// console.log('https://api.edamam.com/search?q=' + row.name + '&app_id=21198cff&app_key=a70d395eb9f3cf9dae36fb4b5e638958')
								// })
							});
							// console.log("foodname:", foodName)
						// })
						// pick x search terms
						// for eac
						// ≈
						// request("http://api.yummly.com/v1/api/recipes?_app_id=" + apiKeys.yummly.id +
						// "&_app_key=" + apiKeys.yummly.key +
						// "&requirePictures=true" +
						// "&maxTotalTimeInSeconds=" + cooking[data.rows[0].cookingtime] +
						// "&excludedCourse[]=course^course-Breads" +
						// "&excludedCourse[]=course^course-Beverages" +
						// "&excludedCourse[]=course^course-Condiments and Sauces" +
						// "&excludedCourse[]=course^course-Cocktails" + 
						// "&maxResult=10" +
						// "&start=" + start
						// , function (error, response, body) {
						// 	// console.log(error, response.statusCode)
						// 	if (!error && response.statusCode == 200) {
						// 		yummlyRecipes = body
						// 		// console.log("result:", yummlyRecipes)
						// res.end()
								// resolve(yummlyRecipes);
						// 	}
						// })



					});
				});
			});
		}

		foodQ().then(function (yummlyRecipes) {
			console.log("about to insert into db")
			var addIngriedientToDB = function (item) {
				// console.log("AddIngredientoDB:", item);
				request("http://www.SupermarketAPI.com/api.asmx/COMMERCIAL_SearchByProductName?APIKEY=APIKEY&ItemName=" + item.food + "", function (err, response, xml) {
					parseString(xml, function (err, result) {
						if (err) {
							console.log("Parsing XML Error")
						}
						else {
							// Pick a better one than the first
							var productList = result.ArrayOfProduct_Commercial.Product_Commercial;
							var index = productList.length >= 5 ? 5 : productList.length-1;
							var choice = productList[index];
							if (choice.Itemname[0] !== 'NOITEM') {
								var description = choice.ItemDescription[0].length > 1000 ? choice.ItemDescription[0].substr(0,1000) : choice.ItemDescription[0];
							// console.log("productList:", productList, "index:", index, "choice", choice);
								client.query("INSERT INTO GroceryPrices (name, description, price) VALUES ('"+ choice.Itemname[0] + "','" + description + "'," + choice.Pricing[0] + ");", function(err, productData) {
									if (err) {
										console.log("Error in inserting to GroceryPrices:", err);
									} else {
										// console.log("GroceryPrices result:", productData);
									}
								})
							}
						}
					    // console.log("LOOK AT THISS: ", );
					});
				})
				// var addIngredientsQuery = client.query("INSERT INTO ingredients (name, measure, quantity, description) VALUES ('" + item.food + "','" + item.measure + "'," + item.quantity + ",'" + item.text + "')", function (err, data) {
				// 	if (err) { console.log("ERROR IN INSERT INGREDIENTS:", err)}
				// 	else { console.log("NO ERROR:", data)}
				// 	// priceController.findPrice(item);
				// })
			};
			var insertRecipesIntoDB = function (recipe) {
				// console.log("RECIPE ingredients:", recipe.ingredients);

				// var addCookingTime = function (){
				// 	if (recipe.totalTimeInSeconds >= cooking[2]) {
				// 		return cookingTime = 3;
				// 	} else if (recipe.totalTimeInSeconds >= cooking[1] && recipe.totalTimeInSeconds < cooking[2]) {
				// 		return cookingTime = 2;
				// 	} else {
				// 		return cookingTime = 1;
				// 	} 	
				// }
				// console.log("da recipe:", recipe)
				// var recipeImg = recipe.smallImageUrls ? recipe.smallImageUrls[0] + "0-c": recipe.imageUrlsBySize[Object.keys(recipe.imageUrlsBySize)[0]].replace("90","900")
				// console.log(recipe.label, recipe.image, recipe.url, 2 );
				client.query("INSERT INTO Recipes (name, image, directionsUrl, sourceid) VALUES ('" + recipe.label + "', '" + recipe.image + "', '" + recipe.url + "'," + 2 + ")", function (err) {
					if (err){
						console.log("Edamam recipe already saved in db", err)
					} else {
						console.log("added recipe to database")
					}
				})
				recipe.ingredients.forEach(function(ingredient) {
					addIngriedientToDB(ingredient);
				})

			};
			// yummlyRecipes = JSON.parse(yummlyRecipes);
			yummlyRecipes.forEach(function (item) {
				// getIngredientsFromYummly(item.recipe)
				insertRecipesIntoDB(item.recipe);
			})
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
				var lowOnViableRecipes = 1000;
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