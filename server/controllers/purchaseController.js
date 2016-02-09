var pg = require('pg');
var Promise = require('bluebird');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client = new pg.Client(connectionString);
var request = require('request');
var apiKeys = require('../config/apiKeys');

module.exports = {

	addRecipesToCart: function (req, res){
		var boughtRecipes = ["tacos","burritos","bacon"]
		var createRecipeCart = function (userID, recipeName) {
			var createCart = {
				method: 'POST',
				body: {"cart_name": recipeName, "description": + "idk"},
				json: true,
				url: "https://api.iamdata.co:443/users/" + userID + "/carts?client_id=" + apiKeys.iamdata.id + "&client_secret=" + apiKeys.iamdata.secret + ""
			}
			request(createCart, function (err, response, body){
				if (!err) {
					var cartID = body.result.cart_id;
					// console.log("addRecipesToCartBody: ", )
				}
				console.log("ERROR addRecipesToCartBody: ", err)
			})
		}

		var addIngredientToCart = function (req, res) {
			var id = 101563;
			var recipeName = "Cereal";


		}
		// boughtRecipes.forEach(function (recipeName){
		// 	var userID = req.params.id;
		// 	createRecipeCart(userID, recipeName)


		// })
		
		res.end()
		// for each recipe
		// create cart
			// for each ingredient
				// find ingredient
				// add ingredient to cart
	},

	findIngredient : function (ingredient) {
		// client.connect();
		console.log("passed in ingredient: " , ingredient)
		request("https://api.iamdata.co:443/v1/products?name=" + ingredient + "&full_resp=false&client_id=" + apiKeys.iamdata.id + "&client_secret=" + apiKeys.iamdata.secret + "", function (err, data){
			var results = JSON.parse(data.body);
			console.log("amazon ingredient:", results)

		})
	},


}