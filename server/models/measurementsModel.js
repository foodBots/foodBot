var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

var insertIntoMeasurementsTable = function () {
// 	var client = new pg.Client(connectionString);
// 	client.connect();
// 	INSERT INTO my_table (colname)
// SELECT 'foo'
// WHERE NOT EXISTS (SELECT * FROM my_table)
// 	client.query("INSERT INTO measurements VALUES ('gallons', 'tablespoons")
}