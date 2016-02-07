module.exports = {

  //sql command for user table
  createUsersTable: 'CREATE TABLE IF NOT EXISTS Users' +
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'name VARCHAR(255) NOT NULL,' +
    'email VARCHAR(255) NOT NULL,' +
    'password VARCHAR(255),' +
    "photo varchar(255) DEFAULT 'https://cdn1.iconfinder.com/data/icons/cooking-and-food/510/14-chef-512.png'," +
    'googleID varchar(255) UNIQUE' +
    ')',

  //sql command for user profile
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
    'yummly_id varchar(255) UNIQUE,' +
    'rating int' +
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
     'liked bool NOT NULL' +
     ')',

  // sql command for match join table
  createMatchesQueueTable: 'CREATE TABLE IF NOT EXISTS MatchesQueue' +
    '('+
     'userOne int references Profiles(id) NOT NULL'+
     ')',

    // sql command for userphoto table
  createUserPhotosTable: 'CREATE TABLE IF NOT EXISTS UserPhotos' +
    '('+
    'name varchar(255) PRIMARY KEY,' +
    'id int references Users(id) NOT NULL,' +
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
    'total int' +
    ')'
};

