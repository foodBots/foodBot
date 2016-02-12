var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');
var request = require('request');
var apiKeys = require('../config/apiKeys');
var _ = require('lodash')

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

getAPIrecipes = function() {
		var APIrecipes;

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

	var foodQ = function () {
		client.end();
		client.connect();
		//1. Creates random search query.
		return new Promise (function (resolve, reject) {
				client.end();
				client.connect();
        var randomSearchQuery = chooseRandomSearchQuery();
        console.log(randomSearchQuery, ">>>>>>>>>>>>JASLDKJFASKJDF SEARCH<<<<<<<<<<<");
          client.query('SELECT * from RecipeSearchTerms WHERE id = ' + randomSearchQuery + ';', function (err, result) {
            if (err) {
            	reject(err)
            } else {
            var foodName = result.rows[0].name;
            var foodPage = result.rows[0].page;
            foodPage+= 1;
            console.log(result, ">>>>>>>>>>>>JASLDKJFASKJDF RESULT<<<<<<<<<<<")
              request("https://api.edamam.com/search?q=" + foodName + formatAPIPageSearch(foodPage) + "&app_id=21198cff&app_key=a70d395eb9f3cf9dae36fb4b5e638958", function (err, response, body) {
                if (err) {console.log('Error in request to edemam', err);}
                else {
                  client.query("UPDATE RecipeSearchTerms SET PAGE = " + foodPage + "WHERE ID = " + randomSearchQuery + ";")
                  resolve(JSON.parse(response.body).hits)
                }
            })
           };
        });

    });
  }

	foodQ().then(function (APIrecipes) {

		//Add ingredients to DB and make SUPER call

		var addIngriedientToDB = function (item, recipeID) {
			console.log("3. getting INGRIEDIENTS", recipeID)
			return new Promise (function (resolve, reject) {
				request("http://www.SupermarketAPI.com/api.asmx/COMMERCIAL_SearchByProductName?APIKEY=APIKEY&ItemName=" + item.food + "", function (err, response, xml) {
					parseString(xml, function (err, result) {
						if (err) {
							console.log("Parsing XML Error")
						}
						else {
							// Pick a better one than the first

							//Everything we're getting back from API
							var productList = result.ArrayOfProduct_Commercial.Product_Commercial;

							//We decided to get the fifth
							var index = productList.length > 5 ? 5 : productList.length-1;

							//Finally choose the product
							var choice = productList[index];


							//If search doesn't suck,  then insert
							if (choice.Itemname[0] !== 'NOITEM') {
								var description = choice.ItemDescription[0].length > 1000 ? choice.ItemDescription[0].substr(0,1000) : choice.ItemDescription[0];
							// console.log("productList:", productList, "index:", index, "choice", choice);
								client.query("INSERT INTO GroceryPrices (name, description, price) VALUES ('"+ choice.Itemname[0] + "','" + description + "'," + choice.Pricing[0] + ") RETURNING id;", function(err, productData) {
									if (err) {
										console.log("Error in inserting to GroceryPrices:", err);
									} else {
										var groceryid = productData.rows[0].id;
										estimatedPrice = choice.Pricing[0];
										// console.log("GroceryPrices result:", productData);
										//insert into ingredients
										var addIngredientsQuery = client.query("INSERT INTO ingredients (name, measure, quantity, description, groceryid) VALUES ('" + item.food + "','" + item.measure + "'," + item.quantity + ",'" + item.text + "'," + groceryid + ") RETURNING id;", function (err, data) {
											if (err) { console.log("ERROR IN INSERT INGREDIENTS:", err)}

											else {
												ingredientID = data.rows[0].id
												//insert into join table
												var addToRecipeIngredientsQuery = client.query("INSERT INTO RecipeIngriedients (ingredientid, recipeid) VALUES (" + ingredientID + ", " + recipeID + ")")
												console.log("and it looks like recipe ingredients are being added into ingredients")
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
						recipeID = data.rows[0].id;
						next(recipeID)
						console.log("hey recipes are saving to DB and it worked")
						//Points to ForEACH over all ingredients => Insert Recipes into DB
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

		// function insertRecipes(APIrecipes) {
		// 	var clone = APIrecipes.slice(0);
		// 	(function insertOne() {
		// 		var record = clone.splice(0,1)[0];
		// 		try {
		// 			insertRecipesIntoDB(record.recipe, function(err) {
		// 				if (err) {next(err); return}
		// 				if (record.length === 0) {
		// 					next();
		// 				} else {
		// 					insertOne();
		// 				}
		// 			})
		// 		} catch (exception) {
		// 			next(exception);
		// 		}
		// 	})();
		// }

		var insertRecipesIntoDB = function (recipe) {
			//Consider renaming this variable
			var recipeID = saveRecipeIntoDB(recipe, function (recipeID) {
				var arr = [];
				recipe.ingredients.forEach(function(ingredient) {
					arr.push(addIngriedientToDB(ingredient, recipeID))
				})
				Promise.all(arr).then(function () {
					console.log(recipeID, "5.inside the promise and trying to do the thing where I add recipeprice")
					addRecipeEstimatedPrice(recipeID)
					}).catch(function(err) {
						insertRecipesIntoDB.on("end", function() {
						console.log("ERROR. query ended")
					})
				})
			})
		}

		//Consider refactoring this whole function to make more sense
		APIrecipes.forEach(function (item) {
			insertRecipesIntoDB(item.recipe)
		})
	}).catch(function(err) {
			client.query.on("end", function() {
				console.log("ended")
			})
	})
}

module.exports = {

	retrieveSuggestedRecipes: function (req, res) {
		var client = new pg.Client(connectionString);
		client.connect();
		var uid = parseInt(req.params.id);
		//Hard-coded. Number of viable recipes
		var amtOfRecipes = 40;

		var userAllergies = [];
		var recipeResults = [];

		//1. Checks userrecipe table and returns all recipes that haven't been seen
		var recipeidQuery = client.query("SELECT id FROM Recipes WHERE (Recipes.id) NOT IN ( SELECT recipeid FROM userRecipes WHERE profileid = " + uid + ") LIMIT " + amtOfRecipes + "", function (err, result) {
			if (err) {
				console.log("Error recipeController: 180", ERROR)
			} else {
					//Compile recipes into an array
					result.rows.forEach(function (row) {
						recipeResults.push(row.id)
					});
					var shuffling = _.shuffle(recipeResults)

				  Promise.all(shuffling).then(function () {
						client.query("select recipes.id, recipes.priceestimate, recipes.name, groceryprices.price, recipes.image, ingredients.description, directionsurl from recipes inner join recipeingriedients on (recipes.id = recipeingriedients.recipeid) inner join ingredients ON (ingredients.id = recipeingriedients.ingredientid) inner join groceryprices ON (groceryprices.id = ingredients.groceryid) where recipes.id = ANY($1);", [recipeResults], function (err, sendData) {
							if (err) {
								console.log("had trouble finding it", err)
							}
							res.json(sendData.rows)
					})
				})
			}
		})
	}
}