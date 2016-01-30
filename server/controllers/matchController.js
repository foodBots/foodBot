var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

module.exports = {

	createMatch : function (req, res){
		console.log('AT CREATE MATCH I ::::', req.params.id);
		// TODO: Remove (Temporary for testing)
		var uid = req.params.id;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Query for all recipes user has created or eaten
		var matchesQuery = client.query("SELECT * FROM MatchesQueue LIMIT 1", function (err, result){
			if(result.rowCount === 0){
				var addToMatchQueueQuery = client.query("INSERT INTO MatchesQueue (userone) VALUES ( " + uid + ")");
				addToMatchQueueQuery.on("end", function (){
					if (res) {
						res.sendStatus(200);
					}
				})
			}
		});

		matchesQuery.on("row", function (row, result){
			var addMatchToPairsProfileQuery = client.query("UPDATE Profiles SET match = '" + row.userone + "' WHERE id ='" + uid + "'")
			var addMatchToUsersProfileQuery = client.query("UPDATE Profiles SET match = '" + uid + "' WHERE id ='" + row.userone + "'")
			var removePairFromMatchesQueueQuery = client.query("DELETE FROM matchesQueue WHERE userone = '" + row.userone + "'")
			if (res) {
				res.sendStatus(200);
			}
		})

	// res.sendStatus(500);
	},

	deleteMatch: function (req, res){
		// TODO: Remove (Temporary for testing)
		var uid = req.params.id;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Query for all recipes user has created or eaten
		var removeMatchQuery = client.query("UPDATE Profiles SET match = null WHERE id = '" + uid + "'");
		var removePairMatchQuery =  client.query("UPDATE Profiles SET match = null WHERE match = '" + uid + "'");
		res.sendStatus(200);


	},

	retrieveMatch: function (req, res){

		var uid = req.params.id;

		var client = new pg.Client(connectionString);
		client.connect();

		var matchIDQuery = client.query("SELECT Name FROM Profiles WHERE id = (SELECT Match FROM Profiles WHERE id = " + uid + ")", function (err, result){
			res.send(result.rows[0].name)
		})

	}
}