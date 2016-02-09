var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var Promise = require('bluebird');

module.exports = {
  createOrder: function (req, res) {
    console.log('createOrder controller RECIPES ARE GETTING PASSSED', req.body.recipes);

    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.params.userid;
    var sqlStr = "INSERT INTO Orders (profileid, total) VALUES (" + req.params.userid + "," + req.body.order.total+") RETURNING id;";
    // console.log(sqlStr);
    var query = client.query("INSERT INTO Orders (profileid, total) VALUES (" + req.params.userid + "," + req.body.order.total+") RETURNING id;", function(err, data) {      
      if (err) {
        console.log('error inserting order', err);
      }
      // console.log('inserted order data', data.rows[0].id);
      //build sql str;
      var s = "INSERT INTO RecipeCost (orderid, recipeid, price) VALUES ";      
      req.body.recipes.forEach(function(recipe, index) {
        // console.log('current recipe id', recipe);
        if(index === req.body.recipes.length-1) {
          s += "(" + data.rows[0].id + "," + recipe.recipeid+","+recipe.price+")";
        } else {
          s += "(" + data.rows[0].id + "," + recipe.recipeid+","+recipe.price+"),";
        }      
      });

      var recipeCostQuery = client.query(s, function(err, data) {
        if (err) {
          console.log('error inserting recipeCost', err);
        }
        // console.log('inserted', recipe.recipeid, recipe.total);
      });
      
      var updateQuery = "";
      var updatePromise = function(arrayValues) {
          return new Promise(function(resolve, reject) {        
            arrayValues.forEach(function(recipe, index) {
            updateQuery += "UPDATE userrecipes SET created = true where recipeid = "+recipe.recipeid+"; "  
          })
          resolve(updateQuery)
          })
        }
      recipeCostQuery.on('end', function() {                
        updatePromise(req.body.recipes)
        .then(function(updateQuery) {          
          client.query(updateQuery, function(err, data) {
            console.log(data, "query update in function")
            res.sendStatus(201)
          })
        })  
      })        
      });      
  },
  getOrder: function(req,res) {
    console.log('getOrder controller', req.body);
    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.params.id;
    var query = client.query("SELECT * from Orders WHERE id = " + userId + ")", function(err, data) {
      if(err) {
        console.log('error getting Orders', err);
      }
      console.log('user Orders data', data);
      res.status(200).json(data);
    });
    query.on('end', function() {
      client.end();
    });
  }
};
