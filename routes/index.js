var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var shortid = require('shortid');
var validUrl = require('valid-url');

router.get('/new/:url(*)', function (req, res, next) {
  res.send(req.params.url);
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
