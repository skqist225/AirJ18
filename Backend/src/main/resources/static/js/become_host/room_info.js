$(document).ready(function () {
    if (localStorage.getItem('room')) {
        const { guestNumber, bedNumber, bedRoomNumber, bathRoomNumber } = JSON.parse(
            localStorage.getItem('room')
        );

        $('#guestNumber').text(guestNumber);
        $('#bedNumber').text(bedNumber);
        $('#bedRoomNumber').text(bedRoomNumber);
        $('#bathRoomNumber').text(bathRoomNumber);
    }
    $('.incAndDecBtn').each(function () {
        $(this).click(function () {
            const spanInfoTag = $(this).siblings(`#${$(this).data('edit')}`);
            let spanValue = spanInfoTag.text() * 1;
            const dataFunction = $(this).data('function');

            if (dataFunction === 'dec') {
                if (spanValue > 0) {
                    if (spanValue === 1) $(this).attr('disabled', true);

                    spanInfoTag.html(--spanValue);
                }
            }

            if (dataFunction === 'inc') {
                if (spanValue === 0)
                    $(this)
                        .siblings(`#${$(this).data('edit')}DecBtn`)
                        .removeAttr('disabled');
                spanInfoTag.html(++spanValue);
            }
        });
    });
});

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    const guestNumber = $('#guestNumber').text() * 1;
    const bedNumber = $('#bedNumber').text() * 1;
    const bedRoomNumber = $('#bedRoomNumber').text() * 1;
    const bathRoomNumber = $('#bathRoomNumber').text() * 1;

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            guestNumber,
            bedNumber,
            bedRoomNumber,
            bathRoomNumber,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            guestNumber,
            bedNumber,
            bedRoomNumber,
            bathRoomNumber,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/amenities`;
}
