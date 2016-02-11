var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var client = new pg.Client(connectionString);
client.connect();  
var foodItems = [
  'fish', 
  'potato',
  'chicken',
  'steak',
  'tofu',
  'paleo',
  'breakfast',
  'vegetarian',
  'spicy',
  'baked',
  'broiled',
  'tilapia',
  'stew',
  'vietnamese',
  'mexican',
  'salsa', 
  'beef', 
  'turkey', 
  'spicy', 
  'savory',
  'crunchy',
  'bbq',
  'sauteed',
  'roasted',
  'slowcooked',
  'grilled',
  'steamed',
  'cheesy',
  'salmon',
  'veggie',
  'vegetables', 
  'tempeh',
  'salad', 
  'lentil',
  'tempeh',
  'quinoa',
  'hearty',
  'toast',
  'braised'
];
var recipeSources = ['Yummly', 'Edamam'];


// var foodItemsAndPageNumber = foodItems.reduce(function(memo, ele) {
//   var itemWithPage = {[ele]: 0};
//   memo.push(itemWithPage);
//   return memo;
// }, []);

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
	},
  retrieveNumberOfSearchTerms: function() {
    return foodItems.length;
  }
};
