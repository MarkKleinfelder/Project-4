var express = require('express');
var router = express.Router();
var staticsController = require('../controllers/statics');

router.route('/')
  .get(staticsController.home);


module.exports=router