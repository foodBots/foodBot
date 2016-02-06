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
    console.log('uploadPhotos controller', req.body, req.file);

    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.params.id;
    var sqlStr = "INSERT INTO UserPhotos (id, name, recipeid) VALUES (" + userId + "," + req.file.filename+","+req.body.recipeId+")";
    console.log(sqlStr);
    var query = client.query("INSERT INTO UserPhotos (id, name, recipeid) VALUES (" + userId + ",'" + req.file.filename+"'," +req.body.recipeId+ ")", function(err, data){
      if(err) {
        console.log('error inserting photo', err);
      }
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
    console.log('getPhotos controller', req.body, req.file);
    var client = new pg.Client(connectionString);
    client.connect();
    var userId = req.params.id;
     var query = client.query("SELECT * from UserPhotos WHERE id = " + userId + ")", function(err, data) {
       if(err) {
         console.log('error getting photos', err);
       }
       console.log('user photos data', data);
       res.status(200).json(data);
     });
     query.on('end', function() {
       client.end();
     });
  }
};
