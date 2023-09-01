const axios = require("axios");
const { translateProduct } = require('./translate');

const SINGLE_PRODUCT_URL = 'https://dummyjson.com/products/';

async function getProductsById(prodIdList, lang) {
    let products = [];

    if (prodIdList != undefined && prodIdList != null && prodIdList.length > 0) {
        for (let i = 0; i < prodIdList.length; i++) {
            const prodId = prodIdList[i];
            let url = SINGLE_PRODUCT_URL + prodId;

            await axios.get(url).then(response => {
                translateProduct(response.data, lang).then(res => {
                    products.push(res);
                })
            });
        }
    }

    return products;
}

exports.getProductsById = getProductsById;
