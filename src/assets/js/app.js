'use strict';

const Helper = require('./utils/helper');

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
    const categoriesContainer = $('.sub-header .categories');
    const categoriesSelect = $("#categories-autocomplete");
    let selectLabel = categoriesContainer.find('.category-select .selected-value');

    if (categoriesSelect.length > 0) {
        categoriesContainer.find(':input').autocomplete({
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
    let cartCookie = Helper.getCookie('cart');

    prodId = Number(prodId);

    if (cartCookie == undefined || cartCookie == null && cartCookie.length <= 0) {
        Helper.setCookie('cart', prodId, 7);
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

        Helper.setCookie('cart', cart, 7);
    }

    updateCart();
}

function updateCart() {
    let cartCookie = Helper.getCookie('cart');

    if (cartCookie != undefined && cartCookie != null) {
        let itemCount = cartCookie.split(',').length;

        if (itemCount > 0) {
            let subHeader = $('.sub-header');

            if (subHeader.length > 0) {
                let cartAmount = subHeader.find('.cart-link .amount');

                if (cartAmount.length > 0) {
                    cartAmount.text(itemCount);
                    cartAmount.show();
                }
            }
        }
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

// Purchase event
function purchase() {
    const summary = $('.summary-price');

    if (summary.length > 0) {
        let summaryValueDOM = summary.find('.value');
        let summaryValue = Number(summaryValueDOM.text());

        if (summaryValue > 0) {
            window.open(`/payment/${summaryValue}`, '_blank');
        }
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

    // Purchase function
    $('.btn-purchase').on('click', function () {
        purchase();
    });

}

// Init Function
function init() {
    initCategoriesAutocomplete();
    updateCart();
    initPriceProductCart();
    initEvent();
}

$(window).on('load', function () {
    init();
});
