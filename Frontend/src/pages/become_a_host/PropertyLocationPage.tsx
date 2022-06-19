import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LeftPageContent, RightPageContent } from "../../components/become_a_host";
import PropertyLocationMainContent from "../../components/become_a_host/PropertyLocationMainContent";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import $ from "jquery";
import axios from "axios";

import "./css/location.css";
import { userState } from "../../features/user/userSlice";

interface IPropertyLocationPageProps {}

const PropertyLocationPage: FC<IPropertyLocationPageProps> = () => {
    const accessToken =
        "pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA";

    mapboxgl.accessToken = accessToken;
    const [userLat, setUserLat] = useState(0);
    const [userLng, setUserLng] = useState(0);
    const [placeName, setPlaceName] = useState("");
    const [isAprtNoAndStreetFilledUp, setIsAprtNoAndStreetFilledUp] = useState(false);
    const [isCityFilledUp, setIsCityFilledUp] = useState(false);

    const { user } = useSelector(userState);
    const userName = user?.firstName + " " + user?.lastName;
    const userAvatar = user!.avatarPath;

    const jQueryCode = () => {
        const locationInputContainer = $(".location__input-container");

        if (localStorage.getItem("room")) {
            const { longitude, latitude } = JSON.parse(localStorage.getItem("room")!);
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
            $(this).on("click", function () {
                locationInputContainer.each(function () {
                    if ($(this).hasClass("focus")) {
                        $(this).removeClass("focus");
                        const input = $(this).children().last().children("input");
                        if (!input.val()) {
                            $(this).children().first().removeClass("focus");

                            input.removeClass("focus");
                        }
                    }
                });

                $(this).children().first().addClass("focus");
                $(this).children().last().children("input").addClass("focus");
                $(this).addClass("focus");
            });
        });

        const addressSearchInput = $("#addressLocation");
        addressSearchInput.on("focus", function () {
            $(".location__search-location").first().addClass("input-focus");
            $(".location__location-option-box").first().addClass("input-focus");
        });

        $("#location__search-btn").on("click", function () {
            getPositionFromInput(addressSearchInput.val()! as string, accessToken);
        });

        $("#location__btn-complete-address-id").on("click", function (event) {
            event.preventDefault();

            const aprtNoAndStreet = $("#aprtNoAndStreet").val() || "";
            const city = $("#city").val() || "";
            const state = $("#state").val() || "";
            const country = $("#country").val() || "";

            const placeToSearch = aprtNoAndStreet + " " + city + " " + state + " " + country;
            $("#map").empty();
            getPositionFromInput(placeToSearch, accessToken);

            $("#location__enter-address-option").removeClass("active");
            $(".location__search-location").first().addClass("active");
        });

        const aprtNoAndStreet = $("#aprtNoAndStreet");
        const city = $("#city");

        let aprtNoAndStreetLength = 0;
        let cityLength = 0;

        aprtNoAndStreet.on("keydown", function (event) {
            console.log("on key down");

            if (event.key !== "Backspace") {
                aprtNoAndStreetLength = ($(this).val() as string).length + 1;
            } else {
                aprtNoAndStreetLength--;
            }

            if (aprtNoAndStreetLength > 0) setIsAprtNoAndStreetFilledUp(true);
            else setIsAprtNoAndStreetFilledUp(false);
        });

        city.on("keydown", function (event) {
            console.log("on key down");

            if (event.key !== "Backspace") {
                cityLength = ($(this).val() as string).length + 1;
            } else {
                cityLength--;
            }

            if (cityLength > 0) setIsCityFilledUp(true);
            else setIsCityFilledUp(false);
        });
    };

    function processSearchText(searchText: string) {
        let input = searchText.toString().replace(/ /g, "%20").replace(/,/g, "");
        return input;
    }

    function useCurrentPosition() {
        console.log("clicked");

        getLocation();
        $(".location__search-location").first().removeClass("input-focus");
        $(".location__location-option-box").first().removeClass("input-focus");
    }

    async function getPositionFromInput(placeToSearch: string, accessToken: string) {
        console.log(placeToSearch);
        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeToSearch}.json?access_token=${accessToken}`
        );

        setPlaceName(data.features[0].place_name);

        const position = {
            coords: {
                latitude: data.features[0].center[1],
                longitude: data.features[0].center[0],
            },
        };

        showPosition(position, false);
        $(".location__search-location").first().removeClass("input-focus");
        $(".location__location-option-box").first().removeClass("input-focus");
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
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);

        const userLng2 = position.coords.longitude;
        const userLat2 = position.coords.latitude;

        if (doReverseSearch) {
            const { data } = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng2},${userLat2}.json?access_token=${accessToken}`
            );
            if (data) setPlaceName(data.features[0].place_name);
        }

        var map = new mapboxgl.Map({
            container: "location__map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [userLng2 * 1, userLat2 * 1], // starting position [lng, lat]
            zoom: 13, // starting zoom
        });

        const markerHeight = 50;
        const markerRadius = 10;
        const linearOffset = 25;
        const popupOffsets = {
            top: [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            bottom: [0, -markerHeight],
            "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            left: [markerRadius, (markerHeight - markerRadius) * -1],
            right: [-markerRadius, (markerHeight - markerRadius) * -1],
        };

        const image: HTMLImageElement = document.createElement("img");
        image.src = userAvatar;
        image.setAttribute("style", "width:40px; height:40px; border-radius:50%;object-fit:cover");

        const marker = new mapboxgl.Marker(image)
            .setPopup(
                new mapboxgl.Popup({
                    offset: popupOffsets as any,
                    className: "my-class",
                }) // add popups
                    .setHTML(`<p style="font-size: 22px;margin: 0;">${userName}</p>`)
                    .setMaxWidth("300px")
            )
            .setLngLat([userLng2, userLat2])
            .addTo(map);

        const popup = new mapboxgl.Popup({
            offset: popupOffsets as any,
            className: "my-class",
        })
            .setLngLat([userLng2, userLat2])
            .setHTML(`<p style="font-size: 22px;margin: 0;">${userName}</p>`)
            .setMaxWidth("300px")
            .addTo(map);

        let currentPopup = null;

        map.on("click", e => {
            $(".location__search-location").first().removeClass("input-focus");
            $(".location__location-option-box").first().removeClass("input-focus");

            setUserLat(e.lngLat.lat);
            setUserLng(e.lngLat.lng);

            if (marker) marker.remove();
            if (popup) popup.remove();

            currentPopup = new mapboxgl.Popup({
                offset: popupOffsets as any,
                className: "mapboxgl-popup",
            }) // add popups
                .setHTML(`<h2>${userName}</h2>`)
                .setMaxWidth("300px");

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

        map.on("drag", () => {
            console.log("A drag event occurred.");
        });

        map.on("data", () => {
            $("#map_loading").css("display", "none");
        });
    }

    function displayEnterLocation() {
        $("#location__enter-address-option").addClass("active");

        $(".location__search-location")
            .first()
            .addClass("non-active")
            .removeClass("active input-focus");

        $(".location__location-option-box").first().removeClass("input-focus");
    }

    function showError(error: any) {}

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
                    prevPage='privacy-type'
                    beforeMiddle={
                        <>
                            <div className='location__search-location'>
                                <Div className='normal-flex'>
                                    <Div className='flex-center' width='10%'>
                                        <Image src={getImage("/svg/pin_drop.svg")} size='24px' />
                                    </Div>
                                    <input
                                        type='text'
                                        placeholder='Nhập địa chỉ của bạn'
                                        name='addressLocation'
                                        id='addressLocation'
                                        className='w-100'
                                    />
                                    <div style={{ marginRight: "10px", width: "14%" }}>
                                        <button id='location__search-btn'>Tìm kiếm</button>
                                    </div>
                                </Div>
                                <div className='location__location-option-box'>
                                    <div
                                        className='location__location-option-box-first'
                                        onClick={useCurrentPosition}
                                    >
                                        <Image
                                            src={getImage("/svg/location.svg")}
                                            size='32px'
                                            style={{ margin: "12px" }}
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
                    MainContent={
                        <PropertyLocationMainContent
                            isAprtNoAndStreetFilledUp={isAprtNoAndStreetFilledUp}
                            isCityFilledUp={isCityFilledUp}
                        />
                    }
                    stepNumber={4}
                    userLng={userLng}
                    userLat={userLat}
                    placeName={placeName}
                />
            </Div>
        </Div>
    );
};

export default PropertyLocationPage;
