module.exports = {
  //sql command for user table
  createUserTable: 'CREATE TABLE IF NOT EXISTS Users ' + 
    '(' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'password VARCHAR(20) NOT NULL,' +
    'email VARCHAR(20) NOT NULL' +
    ')',
  //sql command for user profile
  createRecipeTable: 'CREATE TABLE IF NOT EXISTS Recipes ' +
    '(' +
    'id serial NOT NULL PRIMARY KEY, ' +
    'name varchar(20),' + 
    'ingredients varchar(50)[], ' +
    'directions varchar(255)[], ' +
    'cookingTime int, ' +
    'region varchar(25), '+
    'cost int ' +
    ')',
  //sql command for recipe profile
  createProfileTable: 'CREATE TABLE IF NOT EXISTS Profiles' +
    '('+
     'id serial NOT NULL PRIMARY KEY,' +
     'name varchar(20), ' +
     'restrictions varchar(50)[],' +
     'allergies varchar(50)[]' +
     ')'
}