var express = require('express');
const axios = require("axios");
var router = express.Router();
const { translateProducts } = require('../helpers/translate');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('pages/index');
});

module.exports = router;
