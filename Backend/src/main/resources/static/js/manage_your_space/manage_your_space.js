jQuery(document).ready(function () {
    $('#descriptionCounter').text($('#descriptionInput').val().length);
    $('#roomNameCounter').text($('#roomNameInput').val().length);

    $('.radioStatus').each(function () {
        if ($(this).attr('id') === `roomStatus${status === true ? 1 : 0}`) {
            $(this).prop('checked', true);
            return false;
        }
    });

    $('.manage-ys__changeView').each(function () {
        $(this).click(function () {
            animate($(this));

            const dataScroll = $(this).data('scroll');
            const offsetTop = $(dataScroll).offset().top - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        });
    });

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
                    $(this).siblings(`.manage-ys__minus-btn.incAndDecBtn`).removeAttr('disabled');
                spanInfoTag.html(++spanValue);
            }
        });
    });

    const roomImagesTopValue = getOffsetTop('#roomImages');
    const basicRoomInfosTopValue = getOffsetTop('#basicRoomInfos');
    const roomAmentitiesTopValue = getOffsetTop('#roomAmentities');
    const roomLocationTopValue = getOffsetTop('#roomLocation');
    const roomInfoTopValue = getOffsetTop('#roomInfo');

    let anchorRoomImages = $('a[data-scroll="#roomImages"]');
    let anchorBasicRoomInfos = $('a[data-scroll="#basicRoomInfos"]');
    let anchorRoomAmentities = $('a[data-scroll="#roomAmentities"]');
    let anchorRoomLocation = $('a[data-scroll="#roomLocation"]');
    let anchorRoomInfo = $('a[data-scroll="#roomInfo"]');

    $(document).on('scroll', function (e) {
        const topValue = $(document).scrollTop();

        if (topValue <= roomImagesTopValue) {
            if ($('.manage-ys__left-scrolling-menu').first().hasClass('active'))
                $('.manage-ys__left-scrolling-menu').first().removeClass('active');
        } else if (topValue > roomImagesTopValue && topValue < basicRoomInfosTopValue) {
            animate(anchorRoomImages);
        } else if (topValue >= basicRoomInfosTopValue && topValue < roomAmentitiesTopValue) {
            animate(anchorBasicRoomInfos);
        } else if (topValue >= roomAmentitiesTopValue && top < roomInfoTopValue) {
            animate(anchorRoomAmentities);
        } else if (topValue >= roomInfoTopValue && topValue < roomInfoTopValue) {
            animate(anchorRoomLocation);
        } else animate(anchorRoomInfo);
    });

    $('#roomStatus1').change(function () {
        $('#roomStatus0').prop('checked', false);
        $('#deleteRoom').prop('checked', false);
    });

    $('#roomStatus0').change(function () {
        $('#roomStatus1').prop('checked', false);
        $('#deleteRoom').prop('checked', false);
    });

    $('#deleteRoom').change(function () {
        $('#roomStatus0').prop('checked', false);
        $('#roomStatus1').prop('checked', false);
    });

    $('.manage-ys__check-btn').each(function () {
        const dataType = $(this).data('type');

        if (
            dataType === 'prominentAmentities' &&
            prominentAmentitiesID.includes($(this).data('edit'))
        )
            $(this).addClass('checked');
        else if (
            dataType === 'favoriteAmentities' &&
            favoriteAmentitiesID.includes($(this).data('edit'))
        )
            $(this).addClass('checked');
        else {
            if (safeAmentitiesID.includes($(this).data('edit'))) $(this).addClass('checked');
        }

        $(this).click(function () {
            const siblings = $(this).siblings('.manage-ys__uncheck-btn');
            if (siblings.hasClass('checked')) {
                siblings.removeClass('checked');
                const svg = siblings.children().children('svg');
                svg.css('stroke', 'rgb(113, 113, 113)');
            }

            const svg = $(this).children().children('svg');
            if (!$(this).hasClass('checked')) {
                $(this).addClass('checked');
                svg.css('stroke', '#fff');
            } else {
                $(this).removeClass('checked');
                svg.css('stroke', 'rgb(113, 113, 113)');
            }
        });
    });

    $('.manage-ys__uncheck-btn').each(function () {
        $(this).click(function () {
            const siblings = $(this).siblings('.manage-ys__check-btn');
            if (siblings.hasClass('checked')) {
                siblings.removeClass('checked');
                const svg = siblings.children().children('svg');
                svg.css('stroke', 'rgb(113, 113, 113)');
            }

            const svg = $(this).children().children('svg');
            if (!$(this).hasClass('checked')) {
                $(this).addClass('checked');
                svg.css('stroke', '#fff');
            } else {
                $(this).removeClass('checked');
                svg.css('stroke', 'rgb(113, 113, 113)');
            }
        });
    });
});

function getOffsetTop(id) {
    return $(id).offset().top - 80;
}

function animate(self) {
    const currentActive = self.parent().siblings().filter('.active');
    const currentDataIndex = currentActive.data('index') * 1;
    currentActive.removeClass('active');
    const selfIndex = self.parent().data('index') * 1;

    let distance = 0;
    if (selfIndex < currentDataIndex) {
        distance = currentDataIndex - selfIndex;

        self.siblings('div').css('transform', `translateY(${distance * 50}%)`);

        $.keyframe.define([
            {
                name: 'reverseTranslateY',
                '0%': { top: `50%` },
                '100%': {
                    top: `-${distance * 50}%`,
                },
            },
        ]);

        self.parent().addClass('active');

        self.siblings('div').playKeyframe({
            name: 'reverseTranslateY',
            duration: '1s',
            timingFunction: 'linear',
            delay: '0s',
        });
    } else {
        distance = selfIndex - currentDataIndex;
        self.siblings('div').css('transform', 'translateY(-50%)');
        $.keyframe.define([
            {
                name: 'translateY',
                '0%': { top: `-${distance * 50}%` },
                '100%': { top: `50%` },
            },
        ]);

        self.parent().addClass('active');

        self.siblings('div').playKeyframe({
            name: 'translateY',
            duration: '1s',
            timingFunction: 'linear',
            delay: '0s',
        });
    }

    $('.manage-ys__left-scrolling-menu').first().addClass('active');
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            timeout: 10000,
        });
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}

async function showPosition(position) {
    const accessToken =
        'pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA';
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;

    const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng},${userLat}.json?access_token=${accessToken}`
    );

    const { place_name } = data.features[0];
    console.log(place_name);

    if (place_name.length) {
        const placeNameLength = place_name.split(',').length;

        let country22 = place_name.toString().split(',')[placeNameLength - 1] || 'no-country';
        const state2 = place_name.toString().split(',')[placeNameLength - 2] || 'no-state';
        const city2 = place_name.toString().split(',')[placeNameLength - 3] || 'no-city';
        const street2 = place_name.toString().split(',')[placeNameLength - 4] || 'no-street';

        // const value = country22 === 'Vietnam' ? 216 : '';
        $('#manage-ys__location-country').val(216);
        $('#manage-ys__location-state').val(state2 === 'no-state' ? '' : state2);
        $('#manage-ys__location-city').val(city2 === 'no-city' ? '' : city2);
        $('#manage-ys__location-street').val(street2 === 'no-street' ? '' : street2);
    }
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            x.innerHTML = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = 'An unknown error occurred.';
            break;
    }
}

function useCurrentPosition() {
    getLocation();
}

async function updateField(fieldName, dataInput) {
    const postURL = `${baseURL}api/manage-your-space/update/${roomId}/${fieldName}`;
    switch (fieldName) {
        case 'name': {
            const roomName = $(dataInput).val();
            const { data } = await axios.post(postURL, {
                [fieldName]: roomName,
            });

            if (data === 'OK') {
                name = roomName;
                $('#roomName').text(name);
                alertify.success('Cập nhật tên phòng thành công!');
            }
        }
        case 'roomInfo': {
            const bedroom2 = $('#manage-ys__bedRoom').text().trim();
            const bed2 = $('#manage-ys__bed').text().trim();
            const bathroom2 = $('#manage-ys__bathRoom').text().trim();

            const { data } = await axios.post(postURL, {
                bedroom: bedroom2,
                bed: bed2,
                bathroom: bathroom2,
            });

            if (data === 'OK') {
                alertify.success('Cập nhật thông tin phòng thành công!');
                bed = bed2;
                bathroom = bathroom2;
                bedroom = bedroom2;

                $('#manage-ys__bedRoom').text(bedroom);
                $('#manage-ys__bed').text(bed);
                $('#manage-ys__bathRoom').text(bathroom2);
            }

            break;
        }
        case 'groupAndTypeAndPrivacy': {
            const groupId = $('select[id="manage-ys__group-input"]').val();
            const categoryId = $('select[id="manage-ys__type-input"]').val();
            const privacyId = $('select[id="manage-ys__privacy-input"]').val();

            const { data } = await axios.post(postURL, {
                roomGroup: groupId,
                category: categoryId,
                roomPrivacy: privacyId,
            });

            if (data === 'OK') {
                alertify.success('Cập nhật thông tin phòng thành công!');
                roomGroup = groupId * 1;
                category = categoryId * 1;
                roomPrivacy = privacyId * 1;

                $('select[id="manage-ys__group-input"]').val(roomGroup);
                $('select[id="manage-ys__type-input"]').val(category);
                $('select[id="manage-ys__privacy-input"]').val(roomPrivacy);
            }

            break;
        }
        case 'location': {
            const country2 = $('#manage-ys__location-country').val();
            const state2 = $('#manage-ys__location-state').val();
            const city2 = $('#manage-ys__location-city').val();
            const street2 = $('#manage-ys__location-street').val();

            const { data } = await axios.post(postURL, {
                country: country2,
                state: state2,
                city: city2,
                street: street2,
            });

            if (data === 'OK') {
                alertify.success('Cập nhật thông tin phòng thành công!');
                country = country2;
                state = state2;
                city = city2;
                street = street2;

                $('#manage-ys__location-country').val(country);
                $('#manage-ys__location-state').val(state);
                $('#manage-ys__location-city').val(city);
                $('#manage-ys__location-street').val(street);
            }

            break;
        }
        case 'status': {
            const checked = $('input[type="radio"]:checked').attr('id');
            let request = '';
            if (checked.startsWith('roomStatus')) {
                request = checked.substr(-1);
            } else {
                request = 2;
            }

            if (request === 2) {
                window.location.href = `${baseURL}room/${roomId}/delete`;
            } else {
                const { data } = await axios.post(postURL, {
                    status: request,
                });

                if (data === 'OK') {
                    status = request * 1 === 1 ? true : false;
                    alertify.success('Cập nhật thông tin phòng thành công');
                }
            }

            break;
        }
        case 'description': {
            const description2 = $('#descriptionInput').val();

            const { data } = await axios.post(postURL, {
                description: description2,
            });

            if (data === 'OK') {
                alertify.success('Cập nhật thông tin phòng thành công!');
                description = description2;

                $('#descriptionInput').val(description);
            }

            break;
        }
        case 'amentities': {
            let checkedArray = [];
            let uncheckedArray = [];

            $('.manage-ys__check-btn').each(function () {
                if ($(this).hasClass('checked')) {
                    checkedArray.push($(this).data('edit'));
                }
            });

            $('.manage-ys__uncheck-btn').each(function () {
                if ($(this).hasClass('checked')) {
                    uncheckedArray.push($(this).data('edit'));
                }
            });

            console.log(checkedArray.join(',').trim());
            console.log(uncheckedArray.join(',').trim());

            const { data } = await axios.post(postURL, {
                checkedArray: checkedArray.join(',').trim(),
                uncheckedArray: uncheckedArray.join(',').trim(),
            });

            if (data === 'OK') {
                alertify.success('Cập nhật thông tin phòng thành công!');
            }

            break;
        }
    }
}

function displayEditBox(sectionKey) {
    $(`#manage-ys__${sectionKey}-control-container`).addClass('unhideEditBox');
    $(`#manage-ys__${sectionKey}-control-view`).addClass('hideViewBox');
}

function hideEditBox(sectionKey) {
    console.log(sectionKey);
    $(`#manage-ys__${sectionKey}-control-container`).removeClass('unhideEditBox');
    $(`#manage-ys__${sectionKey}-control-view`).removeClass('hideViewBox');

    if (sectionKey === 'roomInfo') {
        $('#manage-ys__bedRoom').text(bedroom);
        $('#manage-ys__bed').text(bed);
        $('#manage-ys__bathRoom').text(bathroom);
    } else if (sectionKey === 'groupAndTypeAndPrivacy') {
        $('select[id="manage-ys__group-input"]').val(roomGroup);
        $('select[id="manage-ys__type-input"]').val(category);
        $('select[id="manage-ys__privacy-input"]').val(roomPrivacy);
    } else if (sectionKey === 'location') {
        $('#manage-ys__location-country').val(country);
        $('#manage-ys__location-street').val(street === null ? '' : street);
        $('#manage-ys__location-city').val(city);
        $('#manage-ys__location-state').val(state);
    } else if (sectionKey === 'status') {
        $('.radioStatus').each(function () {
            if ($(this).attr('id') === `roomStatus${status === true ? 1 : 0}`) {
                $(this).prop('checked', true);
            } else $(this).prop('checked', false);
        });
    } else if (sectionKey === 'description') {
        $('#descriptionInput').val(description);
    } else if (sectionKey === 'name') {
        $('#roomNameInput').val(name);
    }
}

function onKeyDown(event, inputId) {
    const currentLength = $(inputId);
    const currentValue = currentLength.text();
    if (event.key === 'Backspace') {
        if (currentValue * 1 > 0) currentLength.text(currentValue * 1 - 1);
    } else {
        if (currentValue * 1 < 50) currentLength.text(currentValue * 1 + 1);
    }
}

function previewRoom() {
    window.location.href = `${baseURL}room/${roomId}`;
}

function redirectToPhotoPage() {
    window.location.href = `${baseURL}manage-your-space/${roomId}/details/photos`;
}
