const accessToken =
    'pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA';

mapboxgl.accessToken = accessToken;
let userLat = 0,
    userLng = 0,
    isAprtNoAndStreetFilledUp = false,
    isCityFilledUp = false,
    place_name = '';

jQuery(document).ready(function () {
    const locationInputContainer = $('.location__input-container');

    if (localStorage.getItem('room')) {
        const { longitude, latitude } = JSON.parse(
            localStorage.getItem('room')
        );
        showPosition({
            coords: {
                latitude,
                longitude,
            },
        });
    }

    locationInputContainer.each(function () {
        $(this).click(function () {
            locationInputContainer.each(function () {
                if ($(this).hasClass('focus')) {
                    $(this).removeClass('focus');
                    const input = $(this).children().last().children('input');
                    if (!input.val()) {
                        $(this).children().first().removeClass('focus');

                        input.removeClass('focus');
                    }
                }
            });

            $(this).children().first().addClass('focus');
            $(this).children().last().children('input').addClass('focus');
            $(this).addClass('focus');
        });
    });

    const addressSearchInput = $('#addressLocation');
    addressSearchInput.on('focus', function () {
        $('.location__search-location').first().addClass('input-focus');
        $('.location__location-option-box').first().addClass('input-focus');
    });

    $('#location__search-btn').click(function () {
        getPositionFromInput(addressSearchInput.val(), accessToken);
    });

    $('#location__btn-complete-address-id').click(function (event) {
        event.preventDefault();

        const aprtNoAndStreet = $('#aprtNoAndStreet').val();
        const city = $('#city').val();
        const state = $('#state').val();
        const country = $('#country').val();

        const placeToSearch =
            aprtNoAndStreet + ' ' + city + ' ' + state + ' ' + country;

        getPositionFromInput(placeToSearch, accessToken);
    });

    const aprtNoAndStreet = $('#aprtNoAndStreet');
    const city = $('#city');
    const completeButton = $('.location__btn-complete-address');
    let aprtNoAndStreetLength = 0;
    let cityLength = 0;

    aprtNoAndStreet.on('keydown', function (event) {
        if (event.key !== 'Backspace') {
            aprtNoAndStreetLength = $(this).val().length + 1;
        } else {
            aprtNoAndStreetLength--;
        }

        if (aprtNoAndStreetLength > 0) {
            isAprtNoAndStreetFilledUp = true;

            if (isAprtNoAndStreetFilledUp && isCityFilledUp) {
                completeButton.attr('disabled', false);
            }
        } else {
            isAprtNoAndStreetFilledUp = false;

            if (!isAprtNoAndStreetFilledUp || !isCityFilledUp) {
                completeButton.attr('disabled', true);
            }
        }
    });

    city.on('keydown', function (event) {
        if (event.key !== 'Backspace') {
            cityLength = $(this).val().length + 1;
        } else {
            cityLength--;
        }

        if (cityLength > 0) {
            isCityFilledUp = true;

            if (isAprtNoAndStreetFilledUp && isCityFilledUp) {
                completeButton.attr('disabled', false);
            }
        } else {
            isCityFilledUp = false;

            if (!isAprtNoAndStreetFilledUp || !isCityFilledUp) {
                completeButton.attr('disabled', true);
            }
        }
    });
});

async function getPositionFromInput(placeToSearch, accessToken) {
    console.log(placeToSearch);
    const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeToSearch}.json?access_token=${accessToken}`
    );

    place_name = data.features[0].place_name;

    const position = {
        coords: {
            latitude: data.features[0].center[1],
            longitude: data.features[0].center[0],
        },
    };

    showPosition(position, false);
    $('.location__search-location').first().removeClass('input-focus');
    $('.location__location-option-box').first().removeClass('input-focus');
}

function processSearchText(searchText) {
    let input = searchText.toString().replace(/ /g, '%20').replace(/,/g, '');
    return input;
}

function useCurrentPosition() {
    getLocation();
    $('.location__search-location').first().removeClass('input-focus');
    $('.location__location-option-box').first().removeClass('input-focus');
}

function expandSelectTag() {
    const selectTagContainer = $('#selectTagContainer');
    selectTagContainer.css('display', 'block');
}

const x = document.getElementById('demo');
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            timeout: 10000,
        });
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}

function onKeyDown(event) {
    const input = $('.location__input-container')
        .filter('.focus')
        .children()
        .last()
        .children('input.focus');

    const currentValue = input.val();
    console.log(currentValue);
    console.log(currentValue.toString().length);
    if (event.key === 'Backspace') {
        if (currentValue.length === 1) {
            input.parent().siblings().removeClass('focus');
        }
    }
}

function backToSearchLocation() {
    $('#location__enter-address-option').removeClass('active');
    $('.location__search-location').first().addClass('active');
}

function displayEnterLocation() {
    $('#location__enter-address-option').addClass('active');

    $('.location__search-location')
        .first()
        .addClass('non-active')
        .removeClass('active input-focus');

    $('.location__location-option-box').first().removeClass('input-focus');
}

async function showPosition(position, doReverseSearch = true) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    if (doReverseSearch) {
        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng},${userLat}.json?access_token=${accessToken}`
        );
        console.log(data);
        place_name = data.features[0].place_name;
    }

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [userLng * 1, userLat * 1], // starting position [lng, lat]
        zoom: 13, // starting zoom
    });

    const markerHeight = 50;
    const markerRadius = 10;
    const linearOffset = 25;
    const popupOffsets = {
        top: [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        bottom: [0, -markerHeight],
        'bottom-left': [
            linearOffset,
            (markerHeight - markerRadius + linearOffset) * -1,
        ],
        'bottom-right': [
            -linearOffset,
            (markerHeight - markerRadius + linearOffset) * -1,
        ],
        left: [markerRadius, (markerHeight - markerRadius) * -1],
        right: [-markerRadius, (markerHeight - markerRadius) * -1],
    };

    const userName = document.getElementById('userName').value;
    const image = document.createElement('img');
    image.src = document.getElementById('userAvatar').value;
    image.style = 'width:40px; height:40px; border-radius:50%;object-fit:cover';

    const marker = new mapboxgl.Marker(image)
        .setPopup(
            new mapboxgl.Popup({
                offset: popupOffsets,
                className: 'my-class',
            }) // add popups
                .setHTML(`<h2>${userName}</h2>`)
                .setMaxWidth('300px')
        )
        .setLngLat([userLng, userLat])
        .addTo(map);

    const popup = new mapboxgl.Popup({
        offset: popupOffsets,
        className: 'my-class',
    })
        .setLngLat([userLng, userLat])
        .setHTML(`<h1>${userName}</h1>`)
        .setMaxWidth('300px')
        .addTo(map);

    let currentPopup = null;

    map.on('click', e => {
        $('.location__search-location').first().removeClass('input-focus');
        $('.location__location-option-box').first().removeClass('input-focus');

        userLat = e.lngLat.lat;
        userLng = e.lngLat.lng;

        if (marker) marker.remove();
        if (popup) popup.remove();

        currentPopup = new mapboxgl.Popup({
            offset: popupOffsets,
            className: 'mapboxgl-popup',
        }) // add popups
            .setHTML(`<h2>${userName}</h2>`)
            .setMaxWidth('300px');

        newMarker = new mapboxgl.Marker(image)
            // .setPopup(currentPopup)
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map);

        showPosition({
            coords: {
                longitude: e.lngLat.lng,
                latitude: e.lngLat.lat,
            },
        });
    });

    map.on('drag', () => {
        console.log('A drag event occurred.');
    });

    map.on('data', () => {
        $('#map_loading').css('display', 'none');
    });
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

function nextPage() {
    let room = {};
    if (!localStorage.getItem('room')) {
        room = {
            longitude: userLng,
            latitude: userLat,
            place_name,
        };
    } else {
        room = JSON.parse(localStorage.getItem('room'));
        room = {
            ...room,
            longitude: userLng,
            latitude: userLat,
            place_name,
        };
    }
    localStorage.setItem('room', JSON.stringify(room));

    window.location.href = `${baseURL}become-a-host/room-info`;
}
