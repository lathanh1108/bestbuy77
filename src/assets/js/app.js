'use strict';

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

$(window).on('scroll', fixedHeader);

$(window).on('load', fixedHeader);