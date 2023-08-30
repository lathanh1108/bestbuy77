var express = require('express');
const axios = require("axios");
var router = express.Router();
const { translateProducts } = require('../helpers/translate');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('pages/index');
});

/* GET store page. */
router.get('/store', function (req, res, next) {
	let page = req.query.page;
	let limit = 12;
	let skip = 0;
	let select = '&select=id,title,thumbnail,description,price';
	let url = 'https://dummyjson.com/products?limit=12';

	if (page && page > 1) {
		skip = (page - 1) * limit;

		url += '&skip=' + skip;
	}

	url += select;

	axios.get(url).then((response) => {
		let products = response.data.products;
		let total = response.data.total;
		let totalPage = 0;
		let currentPage = page ? Number(page) : 1;

		totalPage = Math.round(total / limit);

		let prevPage = currentPage == 1 ? null : currentPage - 1;
		let nextPage = currentPage == totalPage ? null : currentPage + 1;


		translateProducts(products, req.cookies.lang).then(productsTrans => {
			res.render('pages/store', {
				products: productsTrans,
				currentPage,
				totalPage,
				prevPage,
				nextPage
			});
		})
	})
});

module.exports = router;
