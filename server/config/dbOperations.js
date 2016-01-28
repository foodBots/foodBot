module.exports = {
  //sql command for user table
  createUsersTable: 'CREATE TABLE IF NOT EXISTS Users' +
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'password VARCHAR(255) NOT NULL,' +
    'email VARCHAR(25) NOT NULL' +
    ')',
  //sql command for user profile
  createRecipesTable: 'CREATE TABLE IF NOT EXISTS Recipes' +
    '(' +
    'id serial NOT NULL PRIMARY KEY, ' +
    'name varchar(20),' +
    'ingredients varchar(50)[], ' +
    'directions varchar(255)[], ' +
    'cookingTime int, ' +
    'region varchar(25), '+
    'cost int ,' +
    'complexity int' +
    ')',
  //sql command for recipe profile
  createProfilesTable: 'CREATE TABLE IF NOT EXISTS Profiles' +
    '('+
     'id int references Users(id) PRIMARY KEY,' +
     'name varchar(20), ' +
     'restrictions varchar(50)[], ' +
     'allergies varchar(50)[], ' +
     'match int,' + 
     'cookingTime int,' +
     'foodie bool' +
     ')',
  //sql command for recipe profile join table
  createUserRecipesTable: 'CREATE TABLE IF NOT EXISTS UserRecipes' +
    '('+
     'profileid int references Profiles(id),' +
     'recipeid int references Recipes(id), ' +
     'created bool' +
     ')',
  // sql command for match join table
  createMatchesQueueTable: 'CREATE TABLE IF NOT EXISTS MatchesQueue' +
    '('+
     'userOne int references Profiles(id)'+
     ')'

}

