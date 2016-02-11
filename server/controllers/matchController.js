var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

module.exports = {

	createMatch : function (req, res){
		// TODO: Remove (Temporary for testing)
		console.log("WE GOT NEXT", req.params, req.body)
		var uid = req.params.id;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Query for all recipes user has created or eaten
		var newMatch = function (){
			var matchesQuery = client.query("SELECT * FROM matchesQueue WHERE (userone) in (Select id from profiles WHERE foodie = (SELECT foodie FROM profiles WHERE id = " + uid + "))  LIMIT 1", function (err, result){
				var addToMatchesQueue = function () {
					var addToMatchQueueQuery = client.query("INSERT INTO MatchesQueue (userone) VALUES ( " + uid + ")");
					addToMatchQueueQuery.on("end", function (){
						if (res) {
							res.sendStatus(200);
						}
					});
				}

				var foundMatch = function () {
					var numberUID = Number(uid);
					var matchUserID = result.rows[0].userone;
					if ( numberUID !== matchUserID) {
						var addMatchToPairsProfileQuery = client.query("UPDATE Profiles SET match = '" + matchUserID + "' WHERE id ='" + numberUID + "'")
						var addMatchToUsersProfileQuery = client.query("UPDATE Profiles SET match = '" + numberUID + "' WHERE id ='" + matchUserID + "'")
						var removePairFromMatchesQueueQuery = client.query("DELETE FROM matchesQueue WHERE userone = '" + matchUserID + "'")
						if (res) {
							res.send (200);
						}
					}
				}

				var checkIfInMatchesQueue = function (){
					var checkIfInMatchesQueueQuery = client.query("SELECT * from MatchesQueue WHERE userone = " + uid + "", function (err, MQResult){
						if (MQResult.rowCount >= 1) {
							res.sendStatus(409)
						}
						else {
							if (result.rowCount === 0) {
								addToMatchesQueue();
							}
							else {
								foundMatch();
							}
						}
					});
				}		
				checkIfInMatchesQueue();
			});
		}

		var alreadyMatched = false;
		var checkIfMatch = client.query("SELECT match FROM Profiles WHERE id =" + uid + "", function (err, result){
			if (err) {
				console.log(err, "Nothing found in profiles", result)
			}
			if (result.rows[0].match !== null) {
				alreadyMatched = true;
				res.sendStatus(409);
			}
			else{
				newMatch();
			}
		})


	},

	deleteMatch: function (req, res){
		// TODO: Remove (Temporary for testing)
		var uid = req.params.id;

		// Create Postgress Connection
		var client = new pg.Client(connectionString);
		client.connect();

		// Create Query for all recipes user has created or eaten
		var removeMatchQuery = client.query("UPDATE Profiles SET match = null WHERE id = '" + uid + "'");
		var removePairMatchQuery = client.query("UPDATE Profiles SET match = null WHERE match = '" + uid + "'");
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