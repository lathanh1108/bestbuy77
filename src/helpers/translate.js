const { TranslationServiceClient } = require('@google-cloud/translate');

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'bestbuy77';
const location = 'global';

async function translateText(string) {
    let lang = global.lang ? global.lang : process.env.DEFAULT_LANG;

    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [string],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'en',
        targetLanguageCode: lang,
    };

    // Run request
    const [response] = await translationClient.translateText(request);

    for (const translation of response.translations) {
        return translation.translatedText;
    }
}

async function translateProduct(product) {
    let lang = global.lang ? global.lang : process.env.DEFAULT_LANG;

    if (lang && lang != 'en') {
        let transTitle = await translateText(product.title, lang).then(res => { return res; })
        let transDescription = await translateText(product.description, lang).then(res => { return res; })

        product.title = transTitle;
        product.description = transDescription;
    }

    return product;
}

async function translateProducts(products) {
    let lang = global.lang ? global.lang : process.env.DEFAULT_LANG;

    if (lang && lang != 'en') {
        for (let i = 0; i < products.length; i++) {
            let transProduct = await translateProduct(products[i], lang).then(res => { return res });

            products[i] = transProduct;
        }
    }

    return products;
}

exports.getCategories = translateText;
exports.translateProduct = translateProduct;
exports.translateProducts = translateProducts;