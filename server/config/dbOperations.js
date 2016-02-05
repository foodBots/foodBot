module.exports = {

  //sql command for user table
  createUsersTable: 'CREATE TABLE IF NOT EXISTS Users' +
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'name VARCHAR(255) NOT NULL,' +
    'email VARCHAR(255) NOT NULL,' +
    "photo varchar(255) DEFAULT 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiLi7Ln69zKAhUNxWMKHZo6CKMQjRwIBw&url=http%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fcooks-people&bvm=bv.113370389,d.cGc&psig=AFQjCNFk8JDd74HqUtWZAypvRUyzolx3UA&ust=1454631766701909'," +
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
     'allergies varchar(50), ' +
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
     ')'

}

