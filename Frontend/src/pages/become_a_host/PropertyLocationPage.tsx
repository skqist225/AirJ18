import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LeftPageContent, RightPageContent } from '../../components/become_a_host';
import PropertyLocationMainContent from '../../components/become_a_host/PropertyLocationMainContent';
import { fetchRoomPrivacies } from '../../features/room/roomSlice';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import $ from 'jquery';
import axios from 'axios';
import { RootState } from '../../store';
import './css/location.css';

interface IPropertyLocationPageProps {}

const PropertyLocationPage: FC<IPropertyLocationPageProps> = () => {
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchRoomPrivacies());
    // }, []);

    const accessToken =
        'pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA';

    mapboxgl.accessToken = accessToken;
    let userLat = 0,
        userLng = 0,
        isAprtNoAndStreetFilledUp = false,
        isCityFilledUp = false,
        place_name = '';

    const { user } = useSelector((state: RootState) => state.user);
    const userName = user?.firstName + ' ' + user?.lastName;
    const userAvatar = user!.avatarPath;

    const jQueryCode = () => {
        $(document).on('ready', function () {
            const locationInputContainer = $('.location__input-container');

            if (localStorage.getItem('room')) {
                const { longitude, latitude } = JSON.parse(localStorage.getItem('room')!);
                showPosition(
                    {
                        coords: {
                            latitude,
                            longitude,
                        },
                    },
                    true
                );
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

            $('#location__btn-complete-address-id').on('click', function (event) {
                event.preventDefault();

                const aprtNoAndStreet = $('#aprtNoAndStreet').val();
                const city = $('#city').val();
                const state = $('#state').val();
                const country = $('#country').val();

                const placeToSearch = aprtNoAndStreet + ' ' + city + ' ' + state + ' ' + country;

                getPositionFromInput(placeToSearch, accessToken);
            });

            const aprtNoAndStreet = $('#aprtNoAndStreet');
            const city = $('#city');
            const completeButton = $('.location__btn-complete-address');
            let aprtNoAndStreetLength = 0;
            let cityLength = 0;

            aprtNoAndStreet.on('keydown', function (event) {
                if (event.key !== 'Backspace') {
                    aprtNoAndStreetLength = ($(this).val() as string).length + 1;
                } else {
                    aprtNoAndStreetLength--;
                }

                if (aprtNoAndStreetLength > 0) {
                    isAprtNoAndStreetFilledUp = true;

                    if (isAprtNoAndStreetFilledUp && isCityFilledUp) {
                        completeButton.attr('disabled', 'false');
                    }
                } else {
                    isAprtNoAndStreetFilledUp = false;

                    if (!isAprtNoAndStreetFilledUp || !isCityFilledUp) {
                        completeButton.attr('disabled', 'true');
                    }
                }
            });

            city.on('keydown', function (event) {
                if (event.key !== 'Backspace') {
                    cityLength = ($(this).val() as string).length + 1;
                } else {
                    cityLength--;
                }

                if (cityLength > 0) {
                    isCityFilledUp = true;

                    if (isAprtNoAndStreetFilledUp && isCityFilledUp) {
                        completeButton.attr('disabled', 'false');
                    }
                } else {
                    isCityFilledUp = false;

                    if (!isAprtNoAndStreetFilledUp || !isCityFilledUp) {
                        completeButton.attr('disabled', 'true');
                    }
                }
            });
        });
    };

    function processSearchText(searchText: string) {
        let input = searchText.toString().replace(/ /g, '%20').replace(/,/g, '');
        return input;
    }

    function useCurrentPosition() {
        console.log('clicked');

        getLocation();
        $('.location__search-location').first().removeClass('input-focus');
        $('.location__location-option-box').first().removeClass('input-focus');
    }

    function expandSelectTag() {
        $('#selectTagContainer').css('display', 'block');
    }

    async function getPositionFromInput(placeToSearch: string, accessToken: string) {
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

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError, {
                timeout: 10000,
            });
        } else {
            // x.innerHTML = 'Geolocation is not supported by this browser.';
        }
    }

    async function showPosition(
        position: {
            coords: {
                latitude: number;
                longitude: number;
            };
        },
        doReverseSearch = true
    ) {
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
            container: 'location__map',
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
            'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            left: [markerRadius, (markerHeight - markerRadius) * -1],
            right: [-markerRadius, (markerHeight - markerRadius) * -1],
        };

        const image: HTMLImageElement = document.createElement('img');
        image.src = userAvatar;
        image.setAttribute('style', 'width:40px; height:40px; border-radius:50%;object-fit:cover');

        const marker = new mapboxgl.Marker(image)
            .setPopup(
                new mapboxgl.Popup({
                    offset: popupOffsets as any,
                    className: 'my-class',
                }) // add popups
                    .setHTML(`<h2>${userName}</h2>`)
                    .setMaxWidth('300px')
            )
            .setLngLat([userLng, userLat])
            .addTo(map);

        const popup = new mapboxgl.Popup({
            offset: popupOffsets as any,
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
                offset: popupOffsets as any,
                className: 'mapboxgl-popup',
            }) // add popups
                .setHTML(`<h2>${userName}</h2>`)
                .setMaxWidth('300px');

            let newMarker = new mapboxgl.Marker(image)
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

    // function onKeyDown(event) {
    //     const input = $('.location__input-container')
    //         .filter('.focus')
    //         .children()
    //         .last()
    //         .children('input.focus');

    //     const currentValue = input.val();
    //     console.log(currentValue);
    //     console.log(currentValue.toString().length);
    //     if (event.key === 'Backspace') {
    //         if (currentValue.length === 1) {
    //             input.parent().siblings().removeClass('focus');
    //         }
    //     }
    // }

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

    function showError(error: any) {}

    function nextPage() {
        let room = {};
        if (!localStorage.getItem('room')) {
            room = {
                longitude: userLng,
                latitude: userLat,
                place_name,
            };
        } else {
            room = JSON.parse(localStorage.getItem('room')!);
            room = {
                ...room,
                longitude: userLng,
                latitude: userLat,
                place_name,
            };
        }
        localStorage.setItem('room', JSON.stringify(room));

        window.location.href = `${window.location.origin}/become-a-host/room-info`;
    }

    useEffect(() => {
        jQueryCode();
    }, []);

    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/location.jpg'
                    title='Chỗ ở của bạn nằm ở đâu?'
                />
                <RightPageContent
                    nextPage='room-info'
                    beforeMiddle={
                        <>
                            <div className='location__search-location'>
                                <Div className='normal-flex'>
                                    <Div className='flex-center' width='10%'>
                                        <Image src={getImage('/svg/pin_drop.svg')} size='24px' />
                                    </Div>
                                    <input
                                        type='text'
                                        placeholder='Nhập địa chỉ của bạn'
                                        name='addressLocation'
                                        id='addressLocation'
                                        className='w-100'
                                    />
                                    <div style={{ marginRight: '10px', width: '14%' }}>
                                        <button id='location__search-btn'>Tìm kiếm</button>
                                    </div>
                                </Div>
                                <div className='location__location-option-box'>
                                    <div
                                        className='location__location-option-box-first'
                                        onClick={useCurrentPosition}
                                    >
                                        <Image
                                            src={getImage('/svg/location.svg')}
                                            size='32px'
                                            style={{ margin: '12px' }}
                                        />
                                        <div>Sử dụng vị trí hiện tại của tôi</div>
                                    </div>
                                    <Div height='60px' padding='16px 16px 24px'>
                                        <button
                                            className='location__enter-address-btn'
                                            onClick={displayEnterLocation}
                                        >
                                            Tự nhập địa chỉ
                                        </button>
                                    </Div>
                                </div>
                            </div>
                        </>
                    }
                    MainContent={<PropertyLocationMainContent />}
                    stepNumber={4}
                />
            </Div>
        </Div>
    );
};

export default PropertyLocationPage;
