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
    Helper.addProductToCartCookie(prodId);

    updateCart();
}

// Update cart badge
function updateCart() {
    let cartCookie = Helper.getCartCookie();

    if (cartCookie.length > 0) {
        let subHeader = $('.sub-header');
        let itemCount = cartCookie.length;

        if (subHeader.length > 0) {
            let cartAmount = subHeader.find('.cart-link .amount');

            if (cartAmount.length > 0) {
                cartAmount.text(itemCount);
                cartAmount.show();
            } else {
                cartAmount.text('');
                cartAmount.hide();
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
    var pid = $(ele.currentTarget).data('pid');
    var $prod = $(ele.currentTarget).closest('.product-information');

    if (pid != undefined && pid != null) {
        Helper.removeProductInCartCookie(pid);

        if ($prod.length > 0) {
            $prod.remove();
        }
    }
}

// Update summary total price
function updateSummaryTotalPrice(ele) {
    let checkbox = $(ele.currentTarget),
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

function initImageThumb() {
    var $main = $('#main-carousel');
    var $thumb = $('#thumbnail-carousel');
    if ($main.length > 0 && $thumb.length > 0) {
        var main = new Splide('#main-carousel', {
            type: 'fade',
            rewind: true,
            pagination: false,
            arrows: false,
        });

        var thumbnails = new Splide('#thumbnail-carousel', {
            fixedWidth: 100,
            fixedHeight: 60,
            gap: 10,
            rewind: true,
            pagination: false,
            isNavigation: true,
        });

        main.sync(thumbnails);
        main.mount();
        thumbnails.mount();
    }
}

function login() {
    var $login = $('.login-content');

    if ($login.length > 0) {
        $login.find('.error').show();
    }
}

// Open menu mobile
function openMenu() {
    $('.header').append('<div class="overlay"></div>');
    $('html').addClass('mobile-menu-open');
}

// Close menu mobile
function closeMenu() {
    $('html').removeClass('mobile-menu-open');
    $('.header .overlay').remove();
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
        let prodId = $(e.currentTarget).data('prodid');

        addToCart(prodId);
    })

    $('.btn-buy-now').on('click', function (e) {
        let prodId = $(e.currentTarget).data('prodid');

        addToCart(prodId);

        window.location.href = '/store/checkout'
    })

    // Change quantity event
    $('.btn-change-quantity').on('click', async function (e) {
        let btn = $(e.currentTarget);
        let isPlus = btn.hasClass('plus') ? true : false;

        await changeQuantity(e.currentTarget, isPlus);
        await updateTotalPriceProduct(e.currentTarget);
    })

    // remove product cart
    $('.btn-remove-product').on('click', removeProductOnCart)

    // Update summary total price
    $('input:checkbox[name=check_product]').on('change', updateSummaryTotalPrice)

    // Purchase function
    $('.btn-purchase').on('click', purchase);

    $('.btn-login').on('click', login);

    $('.btn-open-menu').on('click', openMenu);

    $('.btn-close-menu, .overlay').on('click', closeMenu);
}

// Init Function
function init() {
    initCategoriesAutocomplete();
    updateCart();
    initPriceProductCart();
    initImageThumb();
    initEvent();
}

$(window).on('load', function () {
    init();

    $('html').removeClass('loading');
});
