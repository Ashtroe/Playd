var express = require('express');
var router = express.Router();
let axios = require('axios');
const { path } = require('../app');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(__dirname);
  res.sendFile( '../public/pages/index.html', { root: __dirname });
})

module.exports = router;
