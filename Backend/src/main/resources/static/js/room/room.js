const active = 'active';
const imageClassName = '.' + 'cat__image';
const loadTime = 200;
const defaultHeight = 1902;
let globalPage = 1;
let globalCatId = 0;
let rooms = [];

$(document).ready(async function () {
    const catContainers = $('.cat__container');
    const buttonContainers = $('.button__container');
    const categoryId = new URLSearchParams(window.location.search).get('categoryId') * 1;

    $('.img_idt').each(function () {
        if ($(this).data('index') * 1 === 1) $(this).addClass('active');
    });

    catContainers.each(function () {
        if ($(this).data('category-id') * 1 === categoryId) setActiveTab(catContainers, $(this));
    });

    buttonContainers.each(function () {
        $(this).click(function () {
            window.location.href = `${baseURL}?categoryId=${$(this).data('category-id')}`;
        });
    });
    addClickEventForLoveButton(wishlists, user);
});

function setActiveTab(catContainer, self) {
    catContainer.each(function () {
        $(this).removeClass(active);

        const insideLoopimage = $(imageClassName, this);
        insideLoopimage.removeClass(active);
    });

    $(self).addClass(active);
    const image = $(imageClassName, self);
    image.addClass(active);
}

function redirectToRoomDetails(self) {
    window.location.href = `${baseURL}room/${self.data('room-id')}`;
}
