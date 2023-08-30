const { TranslationServiceClient } = require('@google-cloud/translate');
const cookieParser = require('cookie-parser');

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'thanhla-node-translate';
const location = 'global';

async function translateText(string, lang = 'en') {
    var cookies = cookieParser.JSONCookie('lang');

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

async function translateProducts(products, lang = 'en') {
    if (lang && lang != 'en') {
        for (let i = 0; i < products.length; i++) {
            let transTitle = await translateText(products[i].title, lang).then(res => { return res; })
            let transDescription = await translateText(products[i].description, lang).then(res => { return res; })

            products[i].title = transTitle;
            products[i].description = transDescription;
        }
    }

    return products;
}

exports.getCategories = translateText;
exports.translateProducts = translateProducts;