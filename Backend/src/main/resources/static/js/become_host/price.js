jQuery(document).ready(function () {
    if (localStorage.getItem('room')) {
        const { roomPricePerNight } =
            JSON.parse(localStorage.getItem('room')) || 0;

        if (roomPricePerNight && roomPricePerNight > 0) {
            $('#room-price').val('₫' + roomPricePerNight);
        }
    }
});

function decreasePrice(self) {
    const _self = $(self);
    const input = _self
        .parent()
        .siblings('#priceInputContainer')
        .children('input');
    const value = input.val().toString().replace('₫', '');

    if (value >= 129_000) {
        input.val('₫' + (value * 1 - 129_000));
    }
}

function increasePrice(self) {
    const _self = $(self);
    const input = _self
        .parent()
        .siblings('#priceInputContainer')
        .children('input');

    input.val('₫' + (input.val().toString().replace('₫', '') * 1 + 129_000));
}

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    const roomPricePerNight = $('#room-price')
        .val()
        .toString()
        .replace('₫', '');

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            roomPricePerNight,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            roomPricePerNight,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    if (
        $('#room-price').val().toString().replace('₫', '') * 1 >
        1_000_000_000
    ) {
        alert('Vui lòng nhập dưới 1.000.000.000đ');
        return;
    }

    window.location.href = `${baseURL}become-a-host/preview`;
}
