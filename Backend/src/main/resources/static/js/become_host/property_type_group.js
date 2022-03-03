jQuery(document).ready(function () {
    const roomTypeBox = $('.room-group__box');

    if (localStorage.getItem('room')) {
        const { roomGroup } = JSON.parse(localStorage.getItem('room'));
        roomTypeBox.each(function () {
            if ($(this).children('input').val() === roomGroup + '') {
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
    const choosenRoomGroup =
        $('div.room-group__box').filter('.active').children('input').val() * 1;
    const choosenRoomGroupText = $('div.room-group__box')
        .filter('.active')
        .children('.room-type__name')
        .text();

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            roomGroup: choosenRoomGroup,
            roomGroupText: choosenRoomGroupText,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            roomGroup: choosenRoomGroup,
            roomGroupText: choosenRoomGroupText,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/property-type`;
}
