jQuery(document).ready(function () {
    const roomName = $('#room-name');
    const currentLength = $('#currentLength');
    if (localStorage.getItem('room')) {
        const { roomTitle } = JSON.parse(localStorage.getItem('room'));
        if (roomTitle) {
            roomName.val(roomTitle);
            currentLength.text(roomTitle.length);
        }
    }
});

function onKeyDown(event) {
    const currentLength = $('#currentLength');
    const currentValue = currentLength.text();
    if (event.key === 'Backspace') {
        if (currentValue * 1 > 0) currentLength.text(currentValue * 1 - 1);
    } else {
        if (currentValue * 1 < 50) currentLength.text(currentValue * 1 + 1);
    }
}

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    const roomTitle = $('textarea').val();

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            roomTitle,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            roomTitle,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/description`;
}
