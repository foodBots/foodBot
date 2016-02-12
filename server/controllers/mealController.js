var pg = require('pg');
var Promise = require('bluebird');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client;

var makeConnect = function() {
	client = new pg.Client(connectionString);
	client.end();
	client.connect();
}

module.exports = {

	exploreUserMeals: function(req, res) {
		makeConnect();
		var uid = req.params.id
		var foodie;

		var getFoodieStatus = function(id) {
			return new Promise(function(resolve, reject) {
				console.log("in the promise")
				client.query("SELECT foodie from profiles where id="+id+";", function(err, data) {
					foodie = data.rows[0].foodie
					if (foodie === true) {foodie = "true"}
						else {foodie = false}
						console.log("2. foodie = ", foodie)
					resolve(foodie)
				})
			})
		}
		getFoodieStatus(uid).then(function(foodie) {
			client.query("SELECT recipes.id, recipes.priceestimate, users.name as username, userRecipes.profileid, recipes.name, recipes.ingredients, recipes.image, recipes.directionsurl, liked from recipes INNER JOIN userrecipes ON (recipes.id = userrecipes.recipeid) INNER JOIN profiles ON (profiles.id = userRecipes.profileid) JOIN users ON (profiles.id = users.id) WHERE liked=true AND created=true AND foodie="+foodie+" AND users.id != "+uid+";", function(err, data) {
				res.send(data.rows)
				client.end();
			});
		});
	},

	retrieveUserMeals : function (req, res){
		console.log("retrieving user meals")
		makeConnect();
		// Get User ID
		var uid = req.params.id;


		// Create Query for all recipes user has liked
		var userRecipesQuery = client.query("SELECT name, ingredients, image, rating, directionsurl, liked FROM Recipes INNER JOIN UserRecipes ON (Recipes.id = UserRecipes.recipeid) WHERE profileid="+uid+" AND liked=true;");
		//TestQ2: Select name, ingredients, image, rating, directionsurl, liked from Recipes Inner Join UserRecipes ON (Recipes.id = UserRecipes.recipeid) WHERE profileid=17 AND liked=true;

		// Instantiate User Recipes
		var userRecipes = [];

		// Push all db userRecipes to userRecipes Array
		userRecipesQuery.on("row", function (row) {
			userRecipes.push(row);
		});
		userRecipesQuery.on("end", function () {
			var sendData = {recipeView: userRecipes};
			res.send(sendData);
			client.end();
		});
	},

	retrieveMyRecipes : function (req, res){
		console.log("retrieving MY meals")
		makeConnect();
		// Get User ID
		var userid = req.params.id;
		var sendData = {};

		// Create Query for all recipes user has created or seenRecipe

		var userRecipesQuery = client.query("select ur.profileid, ur.recipeid, r.priceestimate as price, r.name as recipeName, r.image as recipeImage, r.rating, u.name as userImage from userrecipes ur left outer join userphotos u on ur.recipeid=u.recipeid inner join recipes r on r.id=ur.recipeid where ur.profileid="+userid+" AND ur.liked=true ORDER by ur.profileid");
		//TestQ2: Select name, ingredients, image, rating, directionsurl, liked from Recipes Inner Join UserRecipes ON (Recipes.id = UserRecipes.recipeid) WHERE profileid=17 AND liked=true;

		// Instantiate User Recipes
		var userRecipes = [];

		// Push all db userRecipes to userRecipes Array
		userRecipesQuery.on("row", function (row) {
			if (row.userimage) {
				row.userimage = '/img/' + row.userimage;
			}
			userRecipes.push(row);
		});
		
		var boughtUserMeals = client.query("select COUNT(*) from orders where profileid = "+userid+" ")

		boughtUserMeals.on("row", function(row) {
			sendData.orders = row.count
		});

		boughtUserMeals.on("end", function() {
			sendData.recipeView = userRecipes
			res.send(sendData)
			client.end();
		});		
	},


	addUserMeal: function (req, res) {
		makeConnect();
		var uid = req.params.id;
		var rejected = req.body.rejected || [];
		var liked = req.body.liked || [];

		//note: if remove happens, you need to slice it off in the client side
		// In case reject passed as string: '[1,2]' instead of array
		if (typeof rejected === "string") {
			rejected = JSON.parse(rejected);
			liked = JSON.parse(liked);
		}
		rejected.forEach(function(recipeID) {
			client.query("INSERT INTO userRecipes (profileid, recipeid, created, liked) VALUES (" + uid + "," + recipeID + ", false, false)", function(err, done) {
				if (err) {"reject fail"}
				else {
					console.log("reject success")
				}
			});
		});
		liked.forEach(function(recipeID) {
			client.query("INSERT INTO userRecipes (profileid, recipeid, created, liked) VALUES (" + uid + "," + recipeID + ", false, true)", function(err, data){
				if (err) {"success fail"}
				else {
					console.log("success success")
				}
			})
		});
		res.sendStatus(201)
	}
}