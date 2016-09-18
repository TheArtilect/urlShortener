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

router.get('/:url(*)', function (req, res, next) {
  mongo.connect(mLab, function (err, db) {
    if (err) throw err
    console.log("Connected")

    var collection = db.collection('links');
    var params = req.params.url;

    var newLink = function (db, callback) {

      if (validUrl.isUri(params)){
        var shortened = shortid.generate();
        var insertObj = { url: params, short: shortened}
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

      /*
      var insertLink = { url: params, short: "short" };
      collection.insert([insertLink]);
      */


    };

    newLink(db, function () {
      db.close();
    });


  });


});




module.exports = router;
