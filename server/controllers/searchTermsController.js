var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client = new pg.Client(connectionString);
client.connect();  
var foodItems = ['fish', 'salad', 'chicken', 'vegetables']
var recipeSources = ['Yummly', 'Edamam']
module.exports = {

	formatSearchTerms: function (seedItems) {
		var foods = "";

		var dbString = seedItems.reduce(function (memo, name){
			memo += "('" + name + "'), ";
			return memo;
		}, foods)

		return dbString.substr(0, dbString.length-2);
		// for each fooditem 
			// add parans
			// add it to a sting
	},

	seedSearchTerms: function () {
		client.query("INSERT INTO RecipeSearchTerms (name) VALUES " + module.exports.formatSearchTerms(foodItems) + "", function (err, result){
			console.log("ERROR:", err)
		});
	},

	seedRecipeSourceIds: function () {
		client.query("INSERT INTO recipeSources (name) VALUES " + module.exports.formatSearchTerms(recipeSources) + "", function (err, result) {
			console.log("ERROR:", err)
		});
	}

}