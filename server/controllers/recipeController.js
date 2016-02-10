var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');
// var priceController = require('./priceController');
var client = new pg.Client(connectionString);

var pageNumber = 1;
var pickNumber = 1;
var estimatedPrice = 0;
var ingredientID = 0;
var counter = 0;
// Which type of food to search for (e.g. Chicken, fish)

var helper = require('../config/helpers.js');
// var priceController = require('./priceController');
var searchTerms = require('./searchTermsController.js');
var parseString = require('xml2js').parseString;
var client = new pg.Client(connectionString);




	// getRecipesFromEdaman = function (){
	// 	request("https://api.edamam.com/search?&&app_id=" + apiKeys.edamam.id + "&app_key=" + apiKeys.edamam.key + "", function (err, data){
	// 		console.log(JSON.parse(data.body).hits)
	// 	})
	// }
var chooseRandomSearchQuery = function() {
  var searchTermsQuantity = searchTerms.retrieveNumberOfSearchTerms();
  var searchTermId = Math.floor((Math.random() * searchTermsQuantity) + 1);
  return searchTermId;
};

var formatAPIPageSearch = function(number) {
	var startQuery = number*10;
	var endQuery = (number + 1) * 10;
	var pageQueryString = "&from=" + startQuery + "&to=" + endQuery;
	return pageQueryString;
};


var getRecipesFromYummly = function (uid) {		
		client.connect();
		var yummlyRecipes;

		var foodQ = function () {
			return new Promise (function (resolve, reject) {
				console.log("FOODQ:");
				var start = 0;
				//Obviously because nothing in here HAS A SOURCEID OF 1.
				var startQuery = client.query("SELECT Count(*) FROM recipes WHERE sourceid=2", function (err, result){
					if (err) {
						console.log("Error in selecting recipesource:", result);
					} else if (result) {
						start = parseInt(result.rows[0].count) + 2;
					}
				})
        startQuery.on("end", function (){
          var randomSearchQuery = chooseRandomSearchQuery();
          console.log('randomSearchQuery:', randomSearchQuery);

          // var userCookingTime = client.query("SELECT cookingTime from Profiles WHERE id = '" + uid + "'", function (err, data) {
            client.query('SELECT * from RecipeSearchTerms WHERE id = ' + randomSearchQuery + ' ', function (err, result) {
              var foodName = result.rows[0].name;
              var foodPage = result.rows[0].page;
              foodPage+= 1;
                request("https://api.edamam.com/search?q=" + foodName + formatAPIPageSearch(foodPage) + "&app_id=21198cff&app_key=a70d395eb9f3cf9dae36fb4b5e638958", function (err, response, body) {
                  if (err) {console.log('Error in request to edemam', err);} 
                  else {
                    client.query("UPDATE RecipeSearchTerms SET PAGE = " + foodPage + "WHERE ID = " + randomSearchQuery + ";")
                    resolve(JSON.parse(response.body).hits)
                  }
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
								var index = productList.length > 5 ? 5 : productList.length-1;
								// console.log("PRODUCT LIST IN REQ", productList);
								var choice = productList[index];

								if (choice.Itemname[0] !== 'NOITEM') {
									var description = choice.ItemDescription[0].length > 1000 ? choice.ItemDescription[0].substr(0,1000) : choice.ItemDescription[0];
								// console.log("productList:", productList, "index:", index, "choice", choice);
									client.query("INSERT INTO GroceryPrices (name, description, price) VALUES ('"+ choice.Itemname[0] + "','" + description + "'," + choice.Pricing[0] + ") RETURNING id;", function(err, productData) {
										if (err) {
											console.log("Error in inserting to GroceryPrices:", err);
										} else {
											console.log("productdata",productData)
											var groceryid = productData.rows[0].id;
											estimatedPrice = choice.Pricing[0];
											// console.log("GroceryPrices result:", productData);
											var addIngredientsQuery = client.query("INSERT INTO ingredients (name, measure, quantity, description, groceryid) VALUES ('" + item.food + "','" + item.measure + "'," + item.quantity + ",'" + item.text + "'," + groceryid + ") RETURNING id;", function (err, data) {
												if (err) { console.log("ERROR IN INSERT INGREDIENTS:", err)}
												
												else {
													ingredientID = data.rows[0].id
													var addToRecipeIngredientsQuery = client.query("INSERT INTO RecipeIngriedients (ingredientid, recipeid) VALUES (" + ingredientID + ", " + recipeID + ")")
													resolve();
												}		// priceController.findPrice(item);
											});

										}
									})
								} else {
									resolve ();
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
							console.log("recipeid", data)
							recipeID = data.rows[0].id;
							next(recipeID)
							// console.log("RECIPE ID BRUH:", recipeID, "ingredientID", ingredientID)

						}
				})
				// return recipeID;
			}
			var addRecipeEstimatedPrice = function (recipeID) {
				console.log("1. I'm attempting to addRecipeEstimatedPrice")
				client.query("UPDATE recipes SET priceestimate = (SELECT SUM(price) from (select price from groceryprices left outer join ingredients on (groceryprices.id = ingredients.groceryid) left outer join recipeingriedients on (ingredients.id = recipeingriedients.ingredientid) where recipeingriedients.recipeid = " + recipeID + " ) as estimatedprice) Where id = " + recipeID + "", function (err,result ) {
					if (err) {
						console.log( "Error in updating price estimates")
					}
				});
			}
			var insertRecipesIntoDB = function (recipe) {
				var recipeID = saveRecipeIntoDB(recipe, function (recipeID) {
					var arr = [];
					recipe.ingredients.forEach(function(ingredient) {
						arr.push(addIngriedientToDB(ingredient, recipeID))
					})
					Promise.all(arr).then(function () {
						console.log(recipeID, "2.inside the promise and trying to do the thing where I add recipeprice")
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
		var client = new pg.Client(connectionString);
		client.connect();
		// Get User ID & amt of recipes
		var uid = parseInt(req.params.id);		
		var amtOfRecipes = req.body.amount || 5;

		// Query allergies for User and Recipes
		// var profileQuery = client.query("SELECT * FROM Profiles WHERE id = " + uid + "", function (err, result){
		// 	if (err) {
		// 		console.log(err)
		// 	}
		// });

		// Instantiate User Allergies Array & Results
		var userAllergies = [];
		var recipeResults = [];
		// On row add allergies recieved from db to userAllergies
		// profileQuery.on("row", function (profileRow) {
			// userAllergies = profileRow.allergies;
			// var totalMatches = 0;
			// SELECT * FROM Recipes WHERE (Recipes.id) NOT IN ( SELECT recipeid FROM userRecipes WHERE profileid = 1 ) AND (cookingtime = profileRow.cookingtime OR cookingtime = (profileRow.cookingtime - 1)
			var recipeidQuery = client.query("SELECT id FROM Recipes WHERE (Recipes.id) NOT IN ( SELECT recipeid FROM userRecipes WHERE profileid = " + uid + ") LIMIT " + amtOfRecipes + "", function (err, result) {
				if (err) {
					console.log("Error recipeController: 180", ERROR)
				}
				else {
					var recipeids = [];
					var promisearr = []
					result.rows.forEach(function (row) {
						recipeids.push(row.id)
					});
					
				    Promise.all(recipeids).then(function () {
						var recipeDataQuery = client.query("select recipes.id, recipes.name, groceryprices.price, ingredients.description from recipes inner join recipeingriedients on (recipes.id = recipeingriedients.recipeid) inner join ingredients ON (ingredients.id = recipeingriedients.ingredientid) inner join groceryprices ON (groceryprices.id = ingredients.groceryid) WHERE recipes.id = ANY($1);", recipeids, function (err, result) {
							returnRecipes();
						})	
					})	


					// var suselect ingredients.name, groceryprices.price, ingredients.description, recipes.image, recipes.id, recipes.name from groceryprices INNER JOIN ingredients ON ingredients.groceryid = groceryprices.id INNER JOIN RecipeIngriedients ON RecipeIngriedients.ingredientid = ingredients.id INNER JOIN recipes ON recipes.id=RecipeIngriedients.recipeid;
				}
			// });
				var returnRecipes = function () {
					var sendData = {recipes: recipeResults}
					// console.log("sending this thingy:",sendData)	
					res.status(200).json(sendData);
					// var lowOnViableRecipes = 1000;
					// if (totalMatches < lowOnViableRecipes) {
						client.end();
						getRecipesFromYummly(uid);
						// getRecipesFromEdaman();
					// }

				}
			// On row add if no user allergies in recipe ingredients add recipe to results

			// foodQuery.on("row", function (foodRow) {
			// 	var ingredientQuery = client.query("SELECT * FROM Ingredients INNER JOIN RecipeIngriedients ON Ingredients.id = RecipeIngriedients.id WHERE RecipeIngriedients.recipeid=" + foodRow.id + " LIMIT " + amtOfRecipes + "", function (err, response) {
			// 		if (err) {

			// 		}
			// 		else {
			// 			response.rows.forEach(function (item, index){
			// 				var priceQuery = client.query("SELECT price FROM groceryprices where id = " + response.rows[index].groceryid + "", function (err, result) {
			// 					// console.log("FXK:",result)
			// 					response.rows[index].price = result.rows[0] ? result.rows[0].price: null
			// 					foodRow.ingredients.push(response.rows[index])
			// 				})
			// 			})
			// 			if (amtOfRecipes > 0){
			// 				recipeResults.push(foodRow);
			// 				amtOfRecipes --;
			// 			}
			// 			totalMatches ++;

			// 			if (amtOfRecipes === 0) {
			// 				console.log("returning em")
			// 				returnRecipes();
			// 			}
			// 		}
			// 		console.log("woah really?", response, "fine whats wrong", err)
			// 	})
			// 	// var recipeIngredients = foodQuery.ingredients;
			// 	// console.log(foodRow)
				
			// 	// ALLERGIES:
			// 	// if (recipeIngredients) {
			// 	// 	var allergyInFood =  recipeIngredients.some(function (food) {
			// 	// 		return userAllergies.indexOf(food) !== -1;
			// 	// 	});
			// 	// 	if (!allergyInFood) {
			// 	// 		console.log("no allergies:", row)
			// 	// 	}
			// 	// }
			// });

			// foodQuer

			// ingredientQuery.

			// })
		})
	}
}