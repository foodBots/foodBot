var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/foodbot';

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './dist/img/');
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + '-' + Date.now()+ '-' + file.originalname);
  }
});

module.exports = {
  uploadPhotos: function (req, res) {
    console.log("1. establishing we get into photo upload")
    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.params.id;
    var sqlStr = "INSERT INTO UserPhotos (profileid, name, recipeid) VALUES (" + userId + "," + req.file.filename+","+req.body.recipeId+")";

    var query = client.query("INSERT INTO UserPhotos (profileid, name, recipeid) VALUES (" + userId + ",'" + req.file.filename+"'," +req.body.recipeId+ ")", function(err, data){
      if(err) {
        console.log('error inserting photo', err);
      }
      console.log("2. upload photos query is successful", req.file.filename)
      res.status(201).json(req.file.filename);
    });
    query.on('end', function() {
      client.end();
    });
  },
  multer: multer({
    storage: storage
  }),
  getPhotos: function(req,res) {
    console.log('3. Within GetPhotos Container', req.body, req.file);
    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.params.id;
     var query = client.query("SELECT * from UserPhotos WHERE profileid = " + userId + ")", function(err, data) {
       if(err) {
         console.log('error getting photos', err);
       }
       console.log('4. Photos are done', data);
       res.status(200).json(data);
     });
     query.on('end', function() {
       client.end();
     });
  }
};
