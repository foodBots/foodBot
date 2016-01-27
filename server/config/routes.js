// links to controllers
var matchController = require('../controllers/matchController.js');
var recipeController = require('../controllers/recipeController.js');
var userController = require('../controllers/userController.js');
var dashboardController = require('../controllers/dashboardController.js');
var helpers = require('./helpers.js');


module.exports = function(app, express) {

	// app.get('/foodBot/user/:id', userController.getUser); // Add AuthChecker
	// app.post('/foodBot/user/signup', userController.signup);
	// app.post('/foodBot/user/signin', userController.signout); // Add AuthChecker
	// app.get('/foodBot/user/signedin', userController.signedin);

	// app.post('/foodBot/recipes/', recipeController.addMeal); // Add AuthChecker
	app.get('/foodBot/recipes/:id',  recipeController.retrieveSuggestedRecipes) // Add AuthChecker

	// app.get('/foodBot/user/home/:id', dashboardController.getUserMeals) // Add AuthChecker
	// app.post('/foodBot/user/home/:id', dashboardController.addMeal); // Add AuthChecker
	// app.get('/foodBot/users/home/:username', dashboardController.getUserProfile) // Add AuthChecker

};
