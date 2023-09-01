var express = require('express');
const axios = require("axios");
var router = express.Router();

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('pages/index');
});

router.get('/payment/:price', function (req, res, next) {
	res.render('pages/payment', {
		order: {
			id: makeid(8),
			total: req.params.price
		}
	})
})

router.get('/auth', function (req, res, next) {
	res.render('pages/login')
})

router.get('/user-manual', function (req, res, next) {
	res.render('pages/under-development')
})

module.exports = router;
