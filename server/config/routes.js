// links to controllers
var matchController = require('../controllers/matchController.js');
var recipeController = require('../controllers/recipeController.js');
var userController = require('../controllers/userController.js');
var profileController = require('../controllers/profileController.js');
var mealController = require('../controllers/mealController.js');
var photoController = require('../controllers/photoController.js');
var ordersController = require('../controllers/ordersController.js');
var purchaseController = require('../controllers/purchaseController.js');

var helpers = require('./helpers.js');
var auth = require('./authOperations.js');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var keys = require('./apiKeys.js');
var passport = require('passport');

module.exports = function(app, express) {

  // app.get('/', auth.checkUser, function(req,res) {
  //   res.redirect('/');
  // });

  app.post('/foodBot/auth/signup', userController.signup);
  // app.get('/foodBot/auth/signin', userController.endSession);

  // app.post('/foodBot/auth/signin', recipeController.getAPIrecipes, userController.signin);
  app.route('/foodBot/auth/signin')
    // .get(recipeController.getAPIrecipes)
    .post(userController.signin);

  app.post('/foodBot/profile/:id', /*auth.checkUser,*/ profileController.addUserProfile);

  app.get('/foodBot/auth/signin', function(req, res) {
    // console.log('initial user after signin', req.session.user);
    res.json(req.session.user);
  });
  app.get('/foodBot/profile/:id', userController.retrieveOneUser);

  app.get('/foodBot/auth/logout', userController.logout);
  // app.get('/foodBot/', userController.checkCreds );

  app.get('/foodBot/recipes/:id', /*auth.checkUser,*/ recipeController.retrieveSuggestedRecipes);

  app.get('/foodBot/meals/:id', /*auth.checkUser,*/ mealController.retrieveMyRecipes);

  app.get('/foodBot/meals/explore/:id', /*auth.checkUser,*/ mealController.exploreUserMeals);

  app.post('/foodBot/meals/:id', /*auth.checkUser,*/ mealController.addUserMeal);

  app.get('/foodBot/match/:id', /*auth.checkUser,*/ matchController.retrieveMatch);
  app.post('/foodBot/match/:id', /*auth.checkUser,*/ matchController.createMatch);
  app.delete('/foodBot/match/:id', /*auth.checkUser,*/ matchController.deleteMatch);

  app.get('/foodBot/profile/:id', /*auth.checkUser,*/ profileController.retrieveOneUser);


  app.put('/foodBot/profile/:id', profileController.updateUserProfile);
  app.get('/foodBot/profile', /*auth.checkUser,*/ profileController.retrieveAllUsers);

  app.get('/foodBot/photos/:id', /*auth.checkUser,*/ photoController.getPhotos);
  app.post('/foodBot/photos/:id', /*auth.checkUser,*/ photoController.multer.single('file'), photoController.uploadPhotos);

  app.get('/foodBot/orders/:userid', /*auth.checkUser,*/ ordersController.getOrder);
  app.post('/foodBot/orders/:userid', /*auth.checkUser,*/ ordersController.createOrder);


  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(user, done) {
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
            id: userData.id,
            userData: {
              email: req.user.email,
              name: req.user.displayName,
              photo: req.user.photos[0].value
            },
            profileData: {
            },
            route: 'Swipe Recipes'
          };
          req.DBid = userObj.id;
          req.session.user = userObj;
          //initialize profile for auth users with dummy data
          profileController.storeProfile(userObj);
          res.redirect('/');
        }
      });
    });
};

