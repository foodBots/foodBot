var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client = new pg.Client(connectionString);
var foodItems = ['fish', 'salad', 'chicken', 'vegetables']
module.exports = {

	formatSearchTerms: function () {
		var foods = "";

		var searchTerms = foodItems.reduce(function (memo, foodName){
			memo += "('" + foodName + "'), ";
			return memo;
		}, foods)

		return searchTerms.substr(0, searchTerms.length-2);
		// for each fooditem 
			// add parans
			// add it to a sting
	},

	seedSearchTerms: function () {
	client.connect();  
		// console.log("inserting in RecipeSearchTerms: ", module.exports.formatSearchTerms())

		client.query("INSERT INTO RecipeSearchTerms (name) VALUES " + module.exports.formatSearchTerms() + "", function (err, result){
			console.log("ERROR:", err)
		});
	}


}