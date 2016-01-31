var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var auth = require('../config/authOperations.js');

module.exports = {
  signup: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    //check if username already exists
    var checkUserQuery = client.query("SELECT * FROM Users where email ='"+req.body.email+"';", function(err, data) {
      if (err) {
        res.status(500).json("We're sorry, an error has occurred");
      } else if (data.rows.length > 0) {
        res.status(400).json('User with that email already exists');
        // res.redirect('/foodBot/auth/signup');
        // res.send({
        //   // status: 400,
        //   // json: 'User with that email already exists',
        //   redirect: '/signup'
        // });
      } else {
        var createUserQuery = client.query("INSERT INTO Users (password, email) VALUES (crypt('"+req.body.password+"', gen_salt('bf', 8)),'"+req.body.email+"') RETURNING id;", function(err, data) {
          var userData = {
            id: data.rows[0].id,
            email: data.rows[0].email
          }
          res.status(201).json(userData);
        });
        createUserQuery.on('end', function(results) {
          auth.createSession(req, res, req.body.email)
          // res.status(201).json('User session created');
          client.end();
        });
      }
    });
    // checkUserQuery.on('end', function(results) {
    //   client.end();
    // });
  },
  retrieveOneUser: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query("SELECT * FROM Users WHERE id = "+req.params.id+";");
    query.on('row', function(data) {
      res.status(200).json(data);
    });
    query.on('end', function() {
      //if no id  was found and res.status was not set, declare error to client
      res.status(400).json("USER does not exist");
      client.end();
    });
  },
  retrieveAllUsers: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var allUsers = [];
    var query = client.query("SELECT * FROM Users;");
    //collect all users in database
     query.on('row', function(data) {
      allUsers.push(data);
    });
    query.on('end', function() {
      res.status(201).json(allUsers);
      client.end();
    });
  },
  signin: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query("SELECT * FROM Users where email ='"+req.body.email+"' AND password = crypt('"+req.body.password+"', password);", function(err, data) {
      if (err) {
        res.status(500).json("We're sorry, an error has occurred");
        console.log('500');
      } else if (data.rows.length < 1) {
        res.status(400).json("Username or password is incorrect");
        console.log('400');
      } else {
        var id = data.rows[0].id
        var userData = {
          id: data.rows[0].id,
          email: data.rows[0].email
        };
        var allUserData = {
          userData: userData,
          profileData: {},
          recipesData: []
        };
        var userQuery = client.query("SELECT * FROM PROFILES as P, UserRecipes as U where P.id = U.profileid and P.id='"+id+"';");
        // , function(err,data){
        //   console.log('profile data', data);
        //   allUserData.profileData = data;
        // });
        // var profileQuery = client.query("SELECT * FROM PROFILES where id='"+id+"';");
        // userQuery.on('row', function(data) {

          // var userRecipesQuery = client.query("SELECT * FROM UserRecipes WHERE profileid='"+id+"';", function(err,data) {
            // auth.createSession(req, res, req.body.email);
            // console.log('req session sign in', req.session);
            // res.redirect('/foodBot/profile')
            // res.status(201).json(profileData);
          // });
          userQuery.on('row', function(data) {
            // console.log(" USER RECIPES ON SIGNIN:", data);
            // allUserData.recipeData = data;
            if (data.liked) {
              allUserData.recipesData.push({
                'recipeid' :data.recipeid,
                'created' :data.created
              });
            }

            allUserData.name = data.name;
            allUserData.budget =data.budget;
            allUserData.diet = data.diet;
            allUserData.match = data.match;
            allUserData.cookingtime = data.cookingtime;
            allUserData.foodie = data.foodie;
            allUserData.id = data.profileid;


            console.log('alluseradat', data);
          });
          userQuery.on('end', function(data) {
            console.log("USER ON END DATA:", allUserData);
            res.status(201).json(allUserData);
          });
        // });
      }
    });
  }
}


//)