var express = require('express');
const axios = require("axios");
var router = express.Router();
const { translateProducts } = require('../helpers/translate');
const { getProductsById } = require('../helpers/product');

const SINGLE_PRODUCT_URL = 'https://dummyjson.com/products/';

/* GET store page. */
router.get('/', function (req, res, next) {
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

router.get('/detail/:prodId', function (req, res, next) {
	res.render('pages/detail');
});

router.get('/categories', function (req, res, next) {
	const categoriesUrl = 'https://dummyjson.com/products/categories';

	axios.get(categoriesUrl).then(response => {
		res.json(response.data);
	});
})

router.get('/checkout', function (req, res, next) {
	let productIdList = req.cookies.cart;
	let products = []

	// convert cookie string to array
	if (productIdList != undefined && productIdList != null && productIdList.length > 0) {
		products = productIdList.split(',');		
	}

	getProductsById(products, req.cookies.lang).then(response => {
		res.render('pages/cart', {
			products: response
		});
	})
});

module.exports = router;
