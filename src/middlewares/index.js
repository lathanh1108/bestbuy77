const axios = require("axios");
const { translateText } = require('../helpers/translate');

// Categories
async function getCategories() {
    let categoriesUrl = "https://dummyjson.com/products/categories";

    axios.get(categoriesUrl).then(res => {
        let categories = res.data;
        let formattedCategories = [];

        for (let i = 0; i < categories.length; i++) {
            await formatCategory(categories[i]).then(res => {
                formattedCategories.push(res);
            });

        }

        return formattedCategories;
    })
}

async function formatCategory(category, lang) {
    let categoryDetail = {
        id: category,
        value: await translateText()
    };
}
