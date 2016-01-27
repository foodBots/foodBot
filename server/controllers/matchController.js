var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

module.exports = {

	createMatch : function (req, res){
		// TODO: Remove (Temporary for testing)
		var uid = req.params.id;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Query for all recipes user has created or eaten
		var userRecipesQuery = client.query("SELECT * FROM Matches WHERE usertwo IS NULL");

		userRecipesQuery.on("row", function (matchQueue){
			client.query("UPDATE Matches SET usertwo = '" + uid + "' WHERE usertwo IS NULL");

		})

	}

}