function setCookie(name, value, days = 7) {
    var expires = "";

    if (days) {
        var date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

function getCurrentLang() {
    const lang = getCookie('lang');

    return lang ? lang : 'en';
}

function getCartCookie() {
    var cart = getCookie('cart');
    var result = [];

    if (cart != undefined && cart != null && cart.length > 0) {
        result = cart.split(',');
    }

    return result;
}

function setCartCookie(products = []) {
    products = products.toString();

    setCookie('cart', products, 7)
}

function addProductToCartCookie(pid = '') {
    var cart = getCartCookie();
    var isExists = cart.indexOf(pid.toString());

    if (pid != undefined && pid != null && isExists == -1) {
        cart.push(pid);

        setCartCookie(cart);
    }
}

function removeProductInCartCookie(pid = null) {
    var cart = getCartCookie();

    if (pid != undefined && pid != null && cart.indexOf(pid.toString()) > -1) {
        cart = cart.filter((value) => { return Number(value) != pid })

        setCartCookie(cart);
    }

}

exports.setCookie = setCookie;
exports.getCookie = getCookie;
exports.getCurrentLang = getCurrentLang;
exports.getCartCookie = getCartCookie;
exports.setCartCookie = setCartCookie;
exports.addProductToCartCookie = addProductToCartCookie;
exports.removeProductInCartCookie = removeProductInCartCookie;