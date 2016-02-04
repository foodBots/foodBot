var pg = require('pg');
var Promise = require('bluebird');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client;

//can probably make this a helper function
var makeConnect = function() {
	client = new pg.Client(connectionString);
	client.connect();	
}

/*helper: 
	A. Abstract PG Query
		1. create connection
		2. do query
		3. send response

	B. Abstract out query text and req inputs
		1. fn(query, input)
*/

module.exports = {

	retrieveUserMeals : function (req, res){
		makeConnect();
		// Get User ID
		var uid = req.params.id;

		// Create Postgres Connection


		// Create Query for all recipes user has created or seenRecipe
		var userRecipesQuery = client.query("SELECT name, ingredients, image, rating, directionsurl, liked FROM Recipes INNER JOIN UserRecipes ON (Recipes.id = UserRecipes.recipeid) WHERE profileid="+uid+" AND liked=true;");
		//TestQ2: Select name, ingredients, image, rating, directionsurl, liked from Recipes Inner Join UserRecipes ON (Recipes.id = UserRecipes.recipeid) WHERE profileid=17 AND liked=true;

		// Instantiate User Recipes
		var userRecipes = [];

		// Push all db userRecipes to userRecipes Array
		userRecipesQuery.on("row", function (row) {
			userRecipes.push(row);
		});
		userRecipesQuery.on("end", function () {
			var sendData = {recipeView: userRecipes}
			res.send(sendData);
		});
	},

	addUserMeal : function (req, res){
		makeConnect()
		console.log(typeof req.body, typeof req.body.rejected)
		var rejected = req.body.rejected;
		var liked = req.body.liked;

		// In case reject passed as string: '[1,2]' instead of array
		if (typeof rejected === "string") {
			rejected = JSON.parse(rejected)
			liked = JSON.parse(liked)
		}

		// Get Client Data
		var uid = req.params.id;

		// Create Insert Meal Query
		if (rejected) {
			rejected.forEach(function (recipeID) {
				var addLikedQuery = client.query("INSERT INTO userRecipes (profileid, recipeid, created, liked) VALUES (" + uid + "," + recipeID + ", false, false)") ;
			});		
		}
		if (liked) {
			liked.forEach(function (recipeID) {
				// var recipeID = recipe.mealID;
				var addRejectedQuery = client.query("INSERT INTO userRecipes (profileid, recipeid, created, liked) VALUES (" + uid + "," + recipeID + ", false, true)") ;
			});
		}

	var redis = require('redis');
	var r = redis.createClient();

	r.on('connect', function() {
  	console.log("redis connected")
	})

	r.set('meal1', "{'thing1': '20 dollars', 'thing2': '2 dollars'}", function() { console.log("meal1 set")
	})
	
	r.get('meal1', function(err, stuff) {
		console.log("stuff is", stuff)
		res.send(stuff)
	})
	}
};
