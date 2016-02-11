var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';
var auth = require('../config/authOperations.js');
var Promise = require('bluebird');

module.exports = {
  // checkCreds: function(req, res) {
  //   console.log("1. First checking to see that we even get inside")
  //   console.log("3.req.session stuff is...", req.session.user)
  //   res.send(req.session.user)
  // },

  // endSession: function(req, res) {
  //   console.log("session ending")
  //   //Something to destroy a session
  //   client.end()
  // },

  signup: function(req, res) {
    var client = new pg.Client(connectionString);
    client.connect();
    //check if username already exists
    var checkUserQuery = client.query("SELECT * FROM Users where email ='"+req.body.email+"';", function(err, data) {
      if (err) {
        res.status(500).json("We're sorry, an error has occurred");
      } else if (data.rows.length > 0) {
        res.status(400).json('User with that email already exists');
      } else {
        var userData ={};
        var createUserQuery = client.query("INSERT INTO Users (password, email, name) VALUES (crypt('"+req.body.password+"', gen_salt('bf', 8)),'"+req.body.email+"','"+req.body.name+"') RETURNING id;", function(err, newData) {
          console.log(newData)
          if(err) {
            console.log('error creating user', err);
            res.status(500).json("We're sorry, an error has occurred");
          }
          userData.id = newData.rows[0].id;
          userData.email = newData.rows[0].email;
          userData.name = newData.rows[0].name;
          userData.photo = newData.rows[0].photo;
          res.status(201).json(userData);
        });
        createUserQuery.on('end', function(results) {
          client.end();
        });
      }
    });
  },
  storeUser: function(profile, next) {
    var userObj = {
      name: profile.displayName,
      email: profile.email,
      photo: profile.photos[0].value,
      googleID: profile.id,
    };
    var client = new pg.Client(connectionString);
    client.connect();
    var checkUserQuery = client.query("SELECT * FROM Users where email ='"+userObj.email+"';", function(err, checkUserData) {
      if (err) {
         next("We're sorry, an error has occurred", null);
      } else if (checkUserData.rows.length > 0) {
          userObj.id = checkUserData.rows[0].id;
        next(null, userObj);
      } else {
        var createUserQuery = client.query("INSERT INTO Users (name, email, photo, googleID) VALUES ('"+userObj.name+"','"+userObj.email+"','"+userObj.photo+"','"+userObj.googleID+"') RETURNING id;", function(err, createUserData) {
          if (err) {console.log ("ERROR IN CREATE USER", err)}
         userObj.id = createUserData.rows[0].id;
         next(null, userObj);
      });
      }
    });
  },
  retrieveOneUser: function(req, res) {
    var id = {};
    var client = new pg.Client(connectionString);
    client.connect();
    var query = client.query("SELECT id, name, email, photo FROM Users WHERE id = '"+req.params.id+"';", function(err,data){
      if (err) {
        console.log('err getting user info on userid');
      }
      console.log('result getting user by id', req.params.id);
      res.json(data.rows[0]);
    });
    query.on('end', function(data) {
      client.end();
      // id.id = data;
      // next(null, id);
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
    });
  },
  signin: function(req, res, next) {
   var client = new pg.Client(connectionString);
   client.connect();

    client.query("SELECT * FROM Users where email ='"+req.body.email+"' AND password = crypt('"+req.body.password+"', password);", function(err, data) {
     if (err) {
       res.status(500).json("We're sorry, an error has occurred");
       } else if (data.rows.length < 1) {
       res.status(400).json("Username or password is incorrect");
       } else {
       var id = data.rows[0].id;
       var userData = {
         email: data.rows[0].email,
         name: data.rows[0].name,
         photo: data.rows[0].photo
       };
       var allUserData = {
         id: id,
         userData: userData,
         profileData: {},
         recipesData: []
       };

       var profileQuery = client.query("SELECT * FROM PROFILES AS P where P.id='"+id+"';")
        profileQuery.on('row', function(data) {
          allUserData.profileData = data;
        });

       var userQuery = client.query("SELECT * FROM PROFILES as P, UserRecipes as U where P.id = U.profileid and P.id='"+id+"';")
        userQuery.on('row', function(data) {
          allUserData.recipesData.push({
            'recipeid': data.recipeid,
             'created': data.created
         });
        });

        // var matchQuery = client.query("SELECT * FROM USERRECIPES WHERE profileid IN (SELECT match from profiles where id='"+id+"');")
        //   var matchRec = allUserData.matchData.recipes
        //   matchQuery.on('row', function(data) {
        //     if(!data.created && data.liked)
        //     matchRec.push(data)
        //   });
        userQuery.on('end', function(data) {
          // console.log("I got to the end of sign in");
          client.end();
          auth.createSession(req, res, allUserData);
          // req.session.user = allUserData;

          console.log('created user session', req.session);
          // res.redirect('/');
          res.send(allUserData);
          // next();
         });
        }
      });
  },
  logout: function(req, res) {
    req.session.destroy(function() {
      res.redirect('/signin');
    });
  }
}