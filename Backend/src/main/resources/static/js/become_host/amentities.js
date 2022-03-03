jQuery(document).ready(function () {
    const prominentAmentities = $('.prominentAmentities');
    const favoriteAmentities = $('.favoriteAmentities');
    const safeAmentities = $('.safeAmentities');

    if (localStorage.getItem('room')) {
        const { prominentAmentity, favoriteAmentity, safeAmentity } = JSON.parse(
            localStorage.getItem('room')
        );

        prominentAmentities.each(function () {
            if ($(this).children('input').first().val() === prominentAmentity + '') {
                $(this).addClass('choosen');
                return false;
            }
        });

        favoriteAmentities.each(function () {
            if ($(this).children('input').first().val() === favoriteAmentity + '') {
                $(this).addClass('choosen');
                return false;
            }
        });

        safeAmentities.each(function () {
            if ($(this).children('input').first().val() === safeAmentity + '') {
                $(this).addClass('choosen');
                return false;
            }
        });
    }

    prominentAmentities.each(function () {
        $(this).click(function () {
            prominentAmentities.each(function () {
                $(this).removeClass('choosen');
            });

            $(this).addClass('choosen');
        });
    });
    favoriteAmentities.each(function () {
        $(this).click(function () {
            favoriteAmentities.each(function () {
                $(this).removeClass('choosen');
            });

            $(this).addClass('choosen');
        });
    });
    safeAmentities.each(function () {
        $(this).click(function () {
            safeAmentities.each(function () {
                $(this).removeClass('choosen');
            });

            $(this).addClass('choosen');
        });
    });
});

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    const prominentAmentity =
        $('.prominentAmentities').filter('.choosen').children('input').first().val() * 1;
    const prominentAmentityName = $('.prominentAmentities')
        .filter('.choosen')
        .children('input[class="amentityName"]')
        .val();

    const prominentAmentityImageName = $('.prominentAmentities')
        .filter('.choosen')
        .children('input')
        .last()
        .val();

    const favoriteAmentity =
        $('.favoriteAmentities').filter('.choosen').children('input').first().val() * 1;

    const favoriteAmentityImageName = $('.favoriteAmentities')
        .filter('.choosen')
        .children('input')
        .last()
        .val();

    const favoriteAmentityName = $('.favoriteAmentities')
        .filter('.choosen')
        .children('input[class="amentityName"]')
        .val();
    const safeAmentity =
        $('.safeAmentities').filter('.choosen').children('input').first().val() * 1;

    const safeAmentityImageName = $('.safeAmentities')
        .filter('.choosen')
        .children('input')
        .last()
        .val();

    const safeAmentityName = $('.safeAmentities')
        .filter('.choosen')
        .children('input[class="amentityName"]')
        .val();

    if (isNaN(prominentAmentity) || isNaN(favoriteAmentity) || isNaN(safeAmentity)) {
        alertify.error('Vui lòng chọn tiện ích trước khi tiếp tục!');
        return;
    }

    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            prominentAmentity,
            favoriteAmentity,
            safeAmentity,
            prominentAmentityImageName,
            favoriteAmentityImageName,
            safeAmentityImageName,
            prominentAmentityName,
            favoriteAmentityName,
            safeAmentityName,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            prominentAmentity,
            favoriteAmentity,
            safeAmentity,
            prominentAmentityImageName,
            favoriteAmentityImageName,
            safeAmentityImageName,
            prominentAmentityName,
            favoriteAmentityName,
            safeAmentityName,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/photos`;
}
