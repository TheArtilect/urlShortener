var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var shortid = require('shortid');
var validUrl = require('valid-url');

var mLab = "mongodb://localhost:27017/url-shortener-microservice";






/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// shorten url input
router.get('/shorten/:url(*)', function (req, res, next) {
  mongo.connect(mLab, function (err, db) {
    if (err) throw err
    console.log("Connected, getting shortened Url")

    var collection = db.collection('links');
    var params = req.params.url;

    //make if statement to see if already in db

    var shortenLink = function (db, callback) {
      if (validUrl.isUri(params)){
        var shortened = shortid.generate();
        var insertObj = { url: params, short: shortened}

        collection.count({}, function (err, num){
          console.log(num)
        })


        collection.insert(insertObj)
        res.json({
          original: params,
          shorten: "localhost:3000/" + shortened
        })
      } else {
        res.json({
          error: "Invalid URL"
        })
      }
    };
    shortenLink(db, function () {
      db.close();
    });

  });
});


/*
router.get('/:shortenedURL', function (req, res, next){
  mongo.connect(mLab, function (err, db){
    if (err) throw err;
    console.log('Connected, redirecting')

    var collection = db.collection('links')
    var params = req.params.url

    var findShortened = function (db, callback) {
      collection.findOne( {
        "short": params
      }, {
      ur: 1,
      _id: 0
      },
      function (error, data) {
        if (error) throw error
        if (data != null){
          res.redirect(data.url);
        } else {
          res.json({
            error: "Shortened link not found in database.  Check shortened link."
          })
        }
      }
    )}

    findShortened (db, function (){
      db.close();
    })


  })
})

*/

module.exports = router;
