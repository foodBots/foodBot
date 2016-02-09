var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');
// var priceController = require('./priceController');
var parseString = require('xml2js').parseString;


var client = new pg.Client(connectionString);

var cooking = {
	1: 600, // half hour in secs
	2: 1800, // hour in secs
	3: 3600 // two hour in secs
}
var pageNumber = 1;
var pickNumber = 1;
var estimatedPrice = 0;
var ingredientID = 0;
var counter = 0;
// Which type of food to search for (e.g. Chicken, fish)

	// getRecipesFromEdaman = function (){
	// 	request("https://api.edamam.com/search?&&app_id=" + apiKeys.edamam.id + "&app_key=" + apiKeys.edamam.key + "", function (err, data){
	// 		console.log(JSON.parse(data.body).hits)
	// 	})
	// }


	getRecipesFromYummly = function (uid) {
		client.connect();
		var yummlyRecipes;
		console.log("in yummly",uid)

		var foodQ = function () {
			return new Promise (function (resolve, reject) {
				var start = 0;
				var startQuery = client.query("SELECT Count(*) FROM recipes WHERE sourceid=1", function (err, result){
					if (result) {
						start = parseInt(result.rows[0].count) + 2;
					}
					console.log("start: ", start)

				})
				startQuery.on("end", function (){
					console.log("A")
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


					});
				});
			});
		}

		foodQ().then(function (yummlyRecipes) {
			var addIngriedientToDB = function (item, recipeID) {
				return new Promise (function (resolve, reject) {
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
									client.query("INSERT INTO GroceryPrices (name, description, price) VALUES ('"+ choice.Itemname[0] + "','" + description + "'," + choice.Pricing[0] + ") RETURNING id;", function(err, productData) {
											console.log("niiiiiii");
										if (err) {
											console.log("Error in inserting to GroceryPrices:", err);
										} else {
											var groceryid = productData.rows[0].id;
											estimatedPrice = choice.Pricing[0];
											// console.log("GroceryPrices result:", productData);
											var addIngredientsQuery = client.query("INSERT INTO ingredients (name, measure, quantity, description, groceryid) VALUES ('" + item.food + "','" + item.measure + "'," + item.quantity + ",'" + item.text + "'," + groceryid + ") RETURNING id;", function (err, data) {
													 console.log("sannnnn")
												if (err) { console.log("ERROR IN INSERT INGREDIENTS:", err)}
												
												else {
													ingredientID = data.rows[0].id
													var addToRecipeIngredientsQuery = client.query("INSERT INTO RecipeIngriedients (ingredientid, recipeid) VALUES (" + ingredientID + ", " + recipeID + ")")
													console.log("GOT HERE BRUHHH", ingredientID)
													resolve();
												}		// priceController.findPrice(item);
											});

										}
									})
								}
							}
						});
					})
					
				})
			};

			var saveRecipeIntoDB = function (recipe, next) {
				var recipeID;

				client.query("INSERT INTO Recipes (name, image, directionsUrl, sourceid, priceEstimate) VALUES ('" + recipe.label + "', '" + recipe.image + "', '" + recipe.url + "'," + 2 + ", " + estimatedPrice + ") RETURNING id", function (err, data) {
						if (err){
							console.log("Edamam recipe already saved in db", err)
						} else {
							recipeID = data.rows[0].id;
							next(recipeID)
							// console.log("RECIPE ID BRUH:", recipeID, "ingredientID", ingredientID)

						}
				})
				// return recipeID;
			}
			var addRecipeEstimatedPrice = function (recipeID) {
			console.log("updating:", recipeID)
				client.query("UPDATE recipes SET priceestimate = (SELECT SUM(price) from (select price from groceryprices left outer join ingredients on (groceryprices.id = ingredients.groceryid) left outer join recipeingriedients on (ingredients.id = recipeingriedients.ingredientid) where recipeingriedients.recipeid = " + recipeID + " ) as estimatedprice) Where id = " + recipeID + "", function (err,result ) {
					if (err) {
						console.log( "CODE IS BROKE")
					}
				});
			}
			var insertRecipesIntoDB = function (recipe) {
				var recipeID = saveRecipeIntoDB(recipe, function (recipeID) {
					var arr = [];
					recipe.ingredients.forEach(function(ingredient) {
						arr.push(addIngriedientToDB(ingredient, recipeID))
					})
					console.log("arr", a)
					Promise.all(arr).then(function () {
						console.log("prmisealll working")
						addRecipeEstimatedPrice(recipeID)
					})			
				})
				// var functionsArr = [];
			}

			yummlyRecipes.forEach(function (item) {
				insertRecipesIntoDB(item.recipe)
			})
		});
	}

module.exports = {
	retrieveSuggestedRecipes: function (req, res) {	
	console.log("retrieveSuggestedRecipes")	
	console.log(1)
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

			console.log("THIS:",result)
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
				console.log(4)
				var sendData = {recipes: recipeResults }
				// console.log("sending this thingy:",sendData)	
				res.status(200).json(sendData);
				var lowOnViableRecipes = 1000;
				console.log("getting from yummly")
				if (totalMatches < lowOnViableRecipes) {
					client.end();
					console.log("calling yummly bruh")
					getRecipesFromYummly(uid);
					// getRecipesFromEdaman();
				}
			})
		})
	}
}