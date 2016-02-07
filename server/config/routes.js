// links to controllers
var matchController = require('../controllers/matchController.js');
var recipeController = require('../controllers/recipeController.js');
var userController = require('../controllers/userController.js');
var profileController = require('../controllers/profileController.js');
var mealController = require('../controllers/mealController.js');
var photoController = require('../controllers/photoController.js');
var ordersController = require('../controllers/ordersController.js');


var helpers = require('./helpers.js');
var auth = require('./authOperations.js');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var keys = require('./apiKeys.js');
var passport = require('passport');

module.exports = function(app, express) {
  // app.get('/', auth.checkUser);
  app.post('/foodBot/auth/signup', userController.signup);
  app.post('/foodBot/auth/signin', userController.signin);

  app.get('/foodBot/auth/logout', userController.logout);

  app.get('/foodBot/recipes/:id', /*auth.checkUser,*/ recipeController.retrieveSuggestedRecipes);

  app.get('/foodBot/meals/:id', /*auth.checkUser,*/ mealController.retrieveUserMeals);
  app.post('/foodBot/meals/:id', /*auth.checkUser,*/ mealController.addUserMeal);

  app.get('/foodBot/match/:id', /*auth.checkUser,*/ matchController.retrieveMatch);
  app.post('/foodBot/match/:id', /*auth.checkUser,*/ matchController.createMatch);
  app.delete('/foodBot/match/:id', /*auth.checkUser,*/ matchController.deleteMatch);

  app.get('/foodBot/profile/:id', /*auth.checkUser,*/ profileController.retrieveOneUser);
  app.post('/foodBot/profile/:id', /*auth.checkUser,*/ profileController.addUserProfile, matchController.createMatch);
  app.put('/foodBot/profile/:id', profileController.updateUserProfile);
  app.get('/foodBot/profile', /*auth.checkUser,*/ profileController.retrieveAllUsers);

  app.get('/foodBot/photos/:id', photoController.getPhotos);
  app.post('/foodBot/photos/:id', photoController.multer.single('file'), photoController.uploadPhotos);

  app.get('/foodBot/orders/:userid', ordersController.getOrder);
  app.post('/foodBot/orders/:userid', ordersController.createOrder);


  passport.serializeUser(function(user, done) {
    console.log('serialze', user);
    done(null, user.email);
  });

  passport.deserializeUser(function(user, done) {
    console.log('deserialize', user);
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
  ));
  //send to google to do the authentication
  app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'] }));
  //the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/foodBot/auth/google' }),
    function(req, res) {
      var userObj = {};
      userController.storeUser(req.user, function(err, userData) {
        if (err) {
          res.json(err);
        } else {
          userObj = {
            name: req.user.displayName,
            id: userData.id,
            photos: req.user.photos[0].value
          }
        req.DBid = userObj.id;
        req.session.user = userObj;
        console.log('req DBid',req.session.user);
        res.redirect('/');
        }
      });
    });
};
