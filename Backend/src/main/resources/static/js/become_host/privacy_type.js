$(document).ready(function () {
    const privacyTypeBox = $('.privacy-type__box');

    if (localStorage.getItem('room')) {
        const { privacyType } = JSON.parse(localStorage.getItem('room'));

        privacyTypeBox.each(function () {
            if ($(this).children('.privacy-type__name').text() === privacyType) {
                $(this).addClass('active');
                return false;
            }
        });
    }

    privacyTypeBox.each(function () {
        $(this).on('click', function () {
            privacyTypeBox.each(function () {
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
    const choosenPrivacyType =
        $('div.privacy-type__box')
            .filter('.active')
            .children('.privacy-type__name')
            .data('privacy-id') * 1;

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            privacyType: choosenPrivacyType,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            privacyType: choosenPrivacyType,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/location`;
}
