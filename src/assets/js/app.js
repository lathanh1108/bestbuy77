'use strict';

/**
 * Helper
 */
function setCookie(name, value, days) {
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
/**
 * End Helper
 */

// Header scroll
function fixedHeader() {
    const header = $('#header');
    let windowTop = $(window).scrollTop();

    if (windowTop > 0) {
        header.addClass('scroll');
    } else {
        header.removeClass('scroll');
    }
}

// Get Categories
function initCategoriesAutocomplete() {
    let pathname = window.location.pathname;

    if (pathname != '/') {
        $.ajax({
            url: "/store/categories",
            success: function (data) {
                var transformed = $.map(data, function (el) {
                    return {
                        label: el.replace(/-/g, ' '),
                        id: el
                    };
                });

                createCategoriesAutocomplete(transformed);
            },
            error: function () {
                return [];
            }
        });
    }
}

// Categories Autocomplete
function createCategoriesAutocomplete(source) {
    const categorieContainer = $('.sub-header .categories');
    const categoriesSelect = $("#categories-autocomplete");
    let selectLabel = categorieContainer.find('.category-select .selected-value');

    if (categoriesSelect.length > 0) {
        categorieContainer.find(':input').autocomplete({
            source: source,
            minLength: 0,
            classes: {
                'ui-autocomplete': 'ui-autocomplete ui-categories-dropdown'
            },
            select: function (event, ui) {
                selectLabel.text(ui.item.label);
                selectLabel.show();
            }
        }).bind('focus', function () {
            $(this).autocomplete("search");
        }).bind('input', function () {
            selectLabel.hide();
        });
    }
}

// Add to cart
function addToCart(prodId) {
    let cartCookie = getCookie('cart');

    prodId = Number(prodId);

    if (cartCookie == undefined || cartCookie == null && cartCookie.length <= 0) {
        setCookie('cart', prodId, 7);
    } else {
        let cart = cartCookie.split(',');
        let isExits = false;

        cart = cart.map((item) => {
            return Number(item);
        })

        isExits = cart.includes(prodId);

        if (!isExits) {
            cart.push(prodId);
        }

        cart = cart.toString();

        setCookie('cart', cart, 7);
    }
}

// Change quantity
async function changeQuantity(ele, isPlus) {
    var quantityInput = $(ele).siblings('.quantity-input').find('input');
    var value = Number(quantityInput.val());

    if (isPlus) {
        value += 1;
    } else {
        if (value > 1) {
            value -= 1;
        }
    }

    quantityInput.val(value);

    return;
}

// Update total price product
async function updateTotalPriceProduct(ele) {
    let product = $(ele).closest('.product-information');
    let total = product.find('.product-total .value');
    let price = Number(product.find('.product-price').data('price'));
    let quantity = Number(product.find('input[name=quantity]').val());
    let totalPrice = 0;

    if (price && quantity) {
        totalPrice = price * quantity;
    }

    total.text(totalPrice);

    return;
}

// Append value DOM to product total
async function appendValueProductTotalDOM(ele) {
    let product = $(ele);
    let productTotal = product.find('.product-total');

    productTotal.append('<span class="value"></span>');

    return;
}

// Init total price for all product on cart
function initPriceProductCart() {
    var products = $('.product-information');

    if (products.length > 0) {
        products.each(async function (index, element) {
            await appendValueProductTotalDOM(element);
            await updateTotalPriceProduct(element);
        });
    }
}

// remove product on cart
function removeProductOnCart(ele) {
}

// Update summary total price
function updateSummaryTotalPrice(ele) {
    let checkbox = $(ele),
        product = checkbox.closest('.product-information'),
        summary = $('.summary-container'),
        isChecked = checkbox.is(':checked');

    if (product.length > 0) {
        let productPrice = Number(product.find('.product-price').data('price'));
        let summaryValueDOM = summary.find('.value');
        let summaryPrice = summary.data('total') != 0 ? Number(summary.data('total')) : 0;

        if (isChecked) {
            summaryPrice += productPrice;
        } else {
            summaryPrice -= productPrice;
        }

        summaryValueDOM.text(summaryPrice);
        summary.data('total', summaryPrice)
    }


}

// Init Event
function initEvent() {
    // Scroll event
    $(window).on('scroll', fixedHeader);

    // Categories element click event
    $('.sub-header .categories').on('click', function (e) {
        $('#categories-autocomplete').trigger('focus');
    });

    // Add to cart click event
    $('.btn-add-to-cart').on('click', function (e) {
        let prodId = $(e.target).data('prodid');

        addToCart(prodId);
    })

    // Change quantity event
    $('.btn-change-quantity').on('click', async function (e) {
        let btn = $(e.currentTarget);
        let isPlus = btn.hasClass('plus') ? true : false;

        await changeQuantity(e.currentTarget, isPlus);
        await updateTotalPriceProduct(e.currentTarget);
    })

    // remove product cart
    $('.btn-remove-product').on('click', function (e) {
        removeProductOnCart(e);
    })

    // Update summary total price
    $('input:checkbox[name=check_product]').on('change', function (e) {
        updateSummaryTotalPrice(e.target)
    })
}

// Init Function
function init() {
    initCategoriesAutocomplete();
    initPriceProductCart();
    initEvent();
}

$(window).on('load', function () {
    init();
});
