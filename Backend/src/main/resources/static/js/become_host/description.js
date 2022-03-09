let descriptions = [];
jQuery(document).ready(function () {
    if (localStorage.getItem('room')) {
        const { descriptions: lsDescriptions } = JSON.parse(localStorage.getItem('room'));
        if (lsDescriptions) {
            descriptions = lsDescriptions;

            if (descriptions.length === 2) {
                jQuery('.description__title-container').each(function () {
                    if (descriptions.includes($(this).children().last().text())) {
                        $(this).addClass('choosen');
                    }
                });
            }
        }
    }

    jQuery('.description__title-container').each(function () {
        $(this).click(function () {
            if ($(this).hasClass('choosen')) {
                $(this).removeClass('choosen');
                descriptions = descriptions.filter(
                    description => description !== $(this).children().last().text()
                );
            } else {
                if (descriptions.length === 2) {
                    jQuery('.description__title-container').each(function () {
                        if ($(this).children().last().text() === descriptions[0]) {
                            $(this).removeClass('choosen');
                        }
                    });

                    $(this).addClass('choosen');
                    descriptions[0] = descriptions[1];
                    descriptions[1] = $(this).children().last().text();
                } else {
                    $(this).addClass('choosen');
                    descriptions.push($(this).children().last().text());
                }
            }
        });
    });
});

function onKeyPress(event) {
    const currentLength = $('#currentLength');
    const currentValue = currentLength.text();
    if (event.key === 'Backspace') {
        if (currentValue * 1 > 0) currentLength.text(currentValue * 1 - 1);
    } else {
        if (currentValue * 1 < 500) currentLength.text(currentValue * 1 + 1);
    }
}

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    if (descriptions.length == 2) {
        let room = {};
        if (!localStorage.getItem('room')) {
            room = {
                descriptions,
            };
        } else {
            room = JSON.parse(localStorage.getItem('room'));
            room = {
                ...room,
                descriptions,
            };
        }
        localStorage.setItem('room', JSON.stringify(room));

        window.location.href = `${baseURL}become-a-host/price`;
    } else {
        alert('Vui lòng chọn 2 mô tả cho nhà/phòng của bạn');
    }
}
