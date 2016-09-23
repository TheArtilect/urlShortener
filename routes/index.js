var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
var validUrl = require('valid-url');

var mLab = "mongodb://daemonea:destroyer33@ds035826.mlab.com:35826/u-short"



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Url Shortener', author: "Ian Agpawa" });
});

// shorten url input
router.get('/shorten/:url(*)', function (req, res, next) {
  mongo.connect(mLab, function (err, db) {
    if (err) throw err
    console.log("Connected, getting shortened Url")

    var collection = db.collection('links');
    var params = req.params.url;

    var local = req.get('host') + "/";

    var shortenLink = function (db, callback) {
      collection.findOne( {
        "url" : params
      }, {
        short: 1,
        _id: 0
      }, function (err, datum){
        if (datum != null) {
          console.log("Getting shortened URL from database")
          res.json({
            originalURL: params,
            shortenedURL: local + "/" + datum.short
          })
        } else {
          if (validUrl.isUri(params)){
            var shortened = shortid.generate()
            var insertObj = {
              url: params,
              short:  shortened
            }

            collection.insert(insertObj);
            res.json({
              originalURL: params,
              shortenedURL: local + '/' + shortened
            })

          } else {
            res.json({
              error: "Invalid URL"
            })
          }
        } //upper else
      }) // collection

    } // shortenLink

    shortenLink(db, function () {
      console.log("Got shortened url")
      db.close();
    });

  })//mongo
}) //router



router.get('/:shortenedURL', function (req, res, next){
  mongo.connect(mLab, function (err, db){
    if (err) throw err;
    console.log('Connected, redirecting')

    var collection = db.collection('links')
    var params = req.params.shortenedURL

    var findShortened = function (db, callback) {
      collection.findOne( {
        "short": params
      }, {
      url: 1,
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



module.exports = router;
