$(document).ready(function () {
    const roomTypeBox = $('.room-type__box');

    if (localStorage.getItem('room')) {
        const { category } = JSON.parse(localStorage.getItem('room'));
        roomTypeBox.each(function () {
            if ($(this).children('input').val() === category + '') {
                $(this).addClass('active');
            }
        });
    }

    roomTypeBox.each(function () {
        $(this).on('click', function () {
            roomTypeBox.each(function () {
                $(this).removeClass('active');
            });

            $(this).addClass('active');
        });
    });
});

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    const chooseRoomType = $('div.room-type__box').filter('.active').children('input').val() * 1;

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            category: chooseRoomType,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            category: chooseRoomType,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/privacy-type`;
}
