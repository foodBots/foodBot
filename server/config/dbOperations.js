var searchController = require('../controllers/searchTermsController');

module.exports = {

  //sql command for user table
  createUsersTable: 'CREATE TABLE IF NOT EXISTS Users' +
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'name VARCHAR(255),' +
    'email VARCHAR(255) NOT NULL,' +
    "photo varchar(455) DEFAULT 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiLi7Ln69zKAhUNxWMKHZo6CKMQjRwIBw&url=http%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fcooks-people&bvm=bv.113370389,d.cGc&psig=AFQjCNFk8JDd74HqUtWZAypvRUyzolx3UA&ust=1454631766701909'," +
    'googleID varchar(255) UNIQUE,' +
    'password varchar(455)' +
    ')',

  createRecipeSourcesTable: 'CREATE TABLE IF NOT EXISTS RecipeSources' +
    '(' +
      'id SERIAL NOT NULL PRIMARY KEY,' + 
      'name varchar(50)' +
    ')',

  createRecipesTable: 'CREATE TABLE IF NOT EXISTS Recipes' +
    '(' +
      'id serial NOT NULL PRIMARY KEY, ' +
      'name varchar(255) NOT NULL,' +
      'ingredients varchar(50)[], ' +
      'directions varchar(255)[], ' +
      'directionsUrl varchar(255), ' +
      'exactCookingTime int, ' +
      'cookingTime int, ' +
      'region varchar(25), '+
      'cost int ,' +
      "image varchar(255) DEFAULT 'http://lh4.ggpht.com/iEyogFzb2gMbVBLSjgPL0qSETW76pRG1hQYRjLOnmU4JDgMdc65v53OZ3WWSvuRO_kY'," +
      'complexity int,' +
      'recipesourceid varchar(255) UNIQUE,' +
      'sourceid int references RecipeSources(id) NOT NULL,' +
      'rating int,' +
      'priceEstimate decimal' +
    ')',
  
    createGroceryPriceTable: 'CREATE TABLE IF NOT EXISTS GroceryPrices' +
    '(' +
       'id SERIAL NOT NULL PRIMARY KEY, ' +
       'name varchar(255), ' +
       'description varchar(1000),' +
       'price decimal NOT NULL' +
    ')' ,

  createIngredientsTable: 'CREATE TABLE IF NOT EXISTS Ingredients' +
    '(' +
      'id SERIAL NOT NULL PRIMARY KEY, ' +
      'name varchar(255),' +
      'quantity real,' +
      'measure varchar(50),' +
      'description varchar(1000),' + 
      'groceryid int references GroceryPrices(id)' +
    ')',

  createRecipeIngredientsTable: 'CREATE TABLE IF NOT EXISTS RecipeIngriedients' +
    '(' +
      'id serial NOT NULL PRIMARY KEY, ' +
      'ingredientid int references Ingredients(id), ' +
      'recipeid int references Recipes(id) ' +
    ')',

  //sql command for recipe profile
  createProfilesTable: 'CREATE TABLE IF NOT EXISTS Profiles' +
    '('+
     'id int references Users(id) NOT NULL PRIMARY KEY,' +
     'name varchar(20), ' +
     'budget int,' +
     'diet varchar(50), ' +
     'allergies varchar(50)[], ' +
     'match int,' +
     'cookingTime int,' +
     'foodie bool' +
     ')',

  //sql command for recipe profile join table
  createUserRecipesTable: 'CREATE TABLE IF NOT EXISTS UserRecipes' +
    '('+
     'profileid int references Profiles(id) NOT NULL,' +
     'recipeid int references Recipes(id) NOT NULL,' +
     'created bool DEFAULT FALSE,' +
     'liked bool NOT NULL,' +
     'unique (profileid, recipeid)' +
     ')',

  // sql command for match join table
  createMatchesQueueTable: 'CREATE TABLE IF NOT EXISTS MatchesQueue' +
    '('+
     'userOne int references Profiles(id) NOT NULL'+
     ')',

    // sql command for userphoto table
  createUserPhotosTable: 'CREATE TABLE IF NOT EXISTS UserPhotos' +
    '('+
    'id serial NOT NULL PRIMARY KEY,' +
    'name varchar(255),' +
    'profileid int references Users(id) NOT NULL,' +
    'recipeid int references Recipes(id) NOT NULL' +
    ')',

  createOrdersTable: 'CREATE TABLE IF NOT EXISTS Orders' +
    '('+
    'id serial NOT NULL PRIMARY KEY,' +
    'profileid int references Users(id) NOT NULL,' +
    'total int' +
    ')',

  createRecipeCostTable: 'CREATE TABLE IF NOT EXISTS RecipeCost' +
    '('+
    'id serial NOT NULL PRIMARY KEY,' +
    'orderid int references Orders(id) NOT NULL,' +
    'recipeid int references Recipes(id) NOT NULL,' +
    'price int' +
    ')',



  createRecipeSearchTerms: 'CREATE TABLE IF NOT EXISTS RecipeSearchTerms' +
    '(' +
      'id SERIAL NOT NULL PRIMARY KEY, ' +
      'name varchar(255), ' +
      'page int DEFAULT 0' +
    ')',

  checkForSeededResults: function (err, data) {
    if (err) {
      console.log("ERROR:", err)
    }
    else {
      // console.log("data: ",data)
      if (data.rows.length === 0) {
        searchController.seedSearchTerms()
      }
    }
  },

  checkForSourceIds: function (err, data) {
    if (err) {
      console.log("ERROR:", err)
    }
    else {
      // console.log("data: ",data)
      if (data.rows.length === 0) {
        searchController.seedRecipeSourceIds()
      }
    }
  }
}




//   createMeasuresTable: 'CREATE TABLE IF NOT EXISTS Measurements' +
//     '(' +
//       'id SERIAL NOT NULL PRIMARY KEY, ' +
//       'name varchar(255),' +
//     ')' +
