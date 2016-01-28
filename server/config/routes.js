// links to controllers
var matchController = require('../controllers/matchController.js');
var recipeController = require('../controllers/recipeController.js');
var userController = require('../controllers/userController.js');
var dashboardController = require('../controllers/dashboardController.js');
var profileController = require('../controllers/profileController.js');
var helpers = require('./helpers.js');
var auth = require('./authOperations.js');


module.exports = function(app, express) {	
    // app.get('/foodBot/profile', userController.retrieveAllUsers); // Add AuthChecker
	app.post('/foodBot/auth/signup', userController.signup);
	app.post('/foodBot/auth/signin', userController.signin); // Add AuthChecker
	// app.get('/foodBot/auth/signedin', userController.signedin);

	// app.post('/foodBot/recipes/', recipeController.addMeal); // Add AuthChecker
	app.get('/foodBot/recipes/:id',  recipeController.retrieveSuggestedRecipes); // Add AuthChecker

	app.get('/foodBot/meals/:id', profileController.retrieveUserMeals); // Add AuthChecker
	app.post('/foodBot/meals/:id', profileController.addUserMeal); // Add AuthChecker
	// app.get('/foodBot/users/home/:username', dashboardController.getUserProfile) // Add AuthChecker

	app.get('/foodBot/profile/:id', auth.checkUser, profileController.retrieveOneUser); // Add 4th argument to direct to matchController
  app.get('/foodBot/profile', auth.checkUser, profileController.retrieveAllUsers); 
	app.post('/foodBot/auth/signup', userController.signup);
	app.post('/foodBot/auth/signin', userController.signin); 
	// app.get('/foodBot/auth/signedin', userController.signedin);

	// app.post('/foodBot/recipes/', auth.checkUser, recipeController.addMeal); // Add AuthChecker
	app.get('/foodBot/recipes/:id',  auth.checkUser, recipeController.retrieveSuggestedRecipes) // Add AuthChecker

	// app.get('/foodBot/user/home/:id', auth.checkUser, dashboardController.getUserMeals) // Add AuthChecker
	// app.post('/foodBot/user/home/:id', auth.checkUser, dashboardController.addMeal); // Add AuthChecker
	// app.get('/foodBot/users/home/:username', auth.checkUser, dashboardController.getUserProfile) // Add AuthChecker

};