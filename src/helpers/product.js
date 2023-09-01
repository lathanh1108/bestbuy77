const axios = require("axios");
const { translateProduct } = require('./translate');

const SINGLE_PRODUCT_URL = 'https://dummyjson.com/products/';


async function getProductsById(prodIdList) {
    let products = [];

    if (prodIdList != undefined && prodIdList != null && prodIdList.length > 0) {
        for (let i = 0; i < prodIdList.length; i++) {
            const prodId = prodIdList[i];

            await getProductById(prodId).then(response => {
                products.push(response);

                return;
            })
        }
    }

    return products;
}

async function getProductById(pid) {
    if (pid != null) {
        let url = SINGLE_PRODUCT_URL + pid;

        let product = await axios.get(url).then(async response => {
            let product = await translateProduct(response.data).then(res => {
                return res;
            })

            product.price = await formatCurrency(product.price).then(price => { return price });

            return product;
        });

        return product;
    }
}

async function productDetail(req, res, next) {
    let pid = req.params.pid;

    if (pid != null) {
        let product = await getProductById(pid).then(response => { return response });

        await res.render('pages/detail', {
            product
        })
    }
}

async function formatCurrency(value) {
    if (global.lang == 'th') {
        return Number(value) * 35.11;
    }

    return value;
}

exports.getProductsById = getProductsById;
exports.getProductById = getProductById;
exports.productDetail = productDetail;
exports.formatCurrency = formatCurrency;
